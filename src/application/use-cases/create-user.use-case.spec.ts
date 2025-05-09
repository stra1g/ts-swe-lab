import { CreateUserUseCase, CreateUserDto } from './create-user.use-case';
import { UnitOfWork } from '../unit-of-work/unit-of-work.interface';
import { OutboxService } from '../outbox/outbox-service.interface';
import { Email } from '../../domain/user/value-objects/email';
import { Username } from '../../domain/user/value-objects/username';
import { Password } from '../../domain/user/value-objects/password';
import { Name } from '../../domain/user/value-objects/name';
import { Result } from '../../domain/common/result';
import { User } from '../../domain/user/user';
import { UserCreatedEvent } from '../../domain/user/events/user-created.event';
import { UserRepositoryInterface } from '../../domain/user/repositories/user-repository.interface';

jest.mock('../../domain/user/value-objects/email');
jest.mock('../../domain/user/value-objects/username');
jest.mock('../../domain/user/value-objects/password');
jest.mock('../../domain/user/value-objects/name');
jest.mock('../../domain/user/user');
jest.mock('../../domain/common/result');

describe('CreateUserUseCase', () => {
  const mockUserId = 'test-user-id';
  const validDto: CreateUserDto = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'StrongP4ssword',
    name: 'Test User',
  };

  let mockUnitOfWork: jest.Mocked<UnitOfWork>;
  let mockOutboxService: jest.Mocked<OutboxService>;
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>;
  let mockUser: jest.Mocked<User>;
  let mockEmail: Email;
  let mockUsername: Username;
  let mockPassword: Password;
  let mockHashedPassword: Password;
  let mockName: Name;
  let mockEvent: UserCreatedEvent;
  let mockSuccessResult: any;
  let mockFailureResult: any;

  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    jest.resetAllMocks();

    mockSuccessResult = (value: any) => ({
      isSuccess: true,
      isFailure: false,
      getValue: jest.fn().mockReturnValue(value),
      getErrorValue: jest.fn().mockReturnValue(''),
    });

    mockFailureResult = (error: string) => ({
      isSuccess: false,
      isFailure: true,
      getValue: jest.fn().mockImplementation(() => {
        throw new Error(error);
      }),
      getErrorValue: jest.fn().mockReturnValue(error),
    });

    mockEmail = { value: 'test@example.com' } as Email;
    mockUsername = { value: 'testuser' } as Username;
    mockPassword = { value: 'StrongP4ssword', isHashed: false } as Password;
    mockHashedPassword = { value: 'hashed-password', isHashed: true } as Password;
    mockName = { value: 'Test User' } as Name;

    mockEvent = {
      eventId: 'event-id',
      eventName: 'UserCreatedEvent',
      occurredOn: new Date(),
    } as UserCreatedEvent;

    mockUser = {
      id: mockUserId,
      email: mockEmail,
      username: mockUsername,
      password: mockHashedPassword,
      name: mockName,
      domainEvents: [mockEvent],
      clearEvents: jest.fn(),
    } as unknown as jest.Mocked<User>;

    mockUserRepository = {
      create: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UserRepositoryInterface>;

    mockUnitOfWork = {
      getUserRepository: jest.fn().mockReturnValue(mockUserRepository),
      execute: jest.fn().mockImplementation(async callback => {
        return await callback();
      }),
      beginTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as jest.Mocked<UnitOfWork>;

    mockOutboxService = {
      addMessage: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<OutboxService>;

    (Result.ok as jest.Mock).mockImplementation(mockSuccessResult);
    (Result.fail as jest.Mock).mockImplementation(mockFailureResult);
    (Result.combine as jest.Mock).mockReturnValue(mockSuccessResult({}));

    (Email.create as jest.Mock).mockReturnValue(mockSuccessResult(mockEmail));
    (Username.create as jest.Mock).mockReturnValue(mockSuccessResult(mockUsername));
    (Password.create as jest.Mock).mockReturnValue(mockSuccessResult(mockPassword));
    (Name.create as jest.Mock).mockReturnValue(mockSuccessResult(mockName));
    (Password.hashPassword as jest.Mock).mockResolvedValue(mockHashedPassword);
    (User.create as jest.Mock).mockReturnValue(mockSuccessResult(mockUser));

    createUserUseCase = new CreateUserUseCase(mockUnitOfWork, mockOutboxService);
  });

  describe('execute', () => {
    it('should successfully create a user when all inputs are valid', async () => {
      const result = await createUserUseCase.execute(validDto);

      expect(result.isSuccess).toBe(true);
      expect(result.getValue()).toBe(mockUserId);

      expect(Email.create).toHaveBeenCalledWith(validDto.email);
      expect(Username.create).toHaveBeenCalledWith(validDto.username);
      expect(Password.create).toHaveBeenCalledWith(validDto.password);
      expect(Name.create).toHaveBeenCalledWith(validDto.name);

      expect((Result.combine as jest.Mock).mock.calls[0][0]).toHaveLength(4);

      expect(mockUnitOfWork.execute).toHaveBeenCalled();
      expect(mockUnitOfWork.getUserRepository).toHaveBeenCalled();

      expect(Password.hashPassword).toHaveBeenCalledWith(mockPassword);

      expect(User.create).toHaveBeenCalledWith({
        email: mockEmail,
        username: mockUsername,
        password: mockHashedPassword,
        name: mockName,
      });

      expect(mockUserRepository.create).toHaveBeenCalledWith(mockUser);

      expect(mockOutboxService.addMessage).toHaveBeenCalledWith(mockEvent, mockUserId, User.name);

      expect(mockUser.clearEvents).toHaveBeenCalled();
    });

    it('should fail if value object creation fails', async () => {
      const validationError = 'Invalid email format';
      const mockFailResult = {
        isSuccess: false,
        isFailure: true,
        getValue: jest.fn().mockImplementation(() => {
          throw new Error(validationError);
        }),
        getErrorValue: jest.fn().mockReturnValue(validationError),
      };

      (Email.create as jest.Mock).mockReturnValue(mockFailResult);
      (Result.combine as jest.Mock).mockReturnValue(mockFailResult);

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe(validationError);

      expect(mockUnitOfWork.execute).not.toHaveBeenCalled();
    });

    it('should fail if user creation fails', async () => {
      const userCreationError = 'Error creating user';
      const mockFailResult = {
        isSuccess: false,
        isFailure: true,
        getValue: jest.fn().mockImplementation(() => {
          throw new Error(userCreationError);
        }),
        getErrorValue: jest.fn().mockReturnValue(userCreationError),
      };

      (User.create as jest.Mock).mockReturnValue(mockFailResult);

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe(userCreationError);

      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });

    it('should handle exceptions from the unit of work', async () => {
      const execError = new Error('Database error');
      mockUnitOfWork.execute.mockRejectedValue(execError);

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('Error creating user');
      expect(result.getErrorValue()).toContain('Database error');
    });

    it('should handle exceptions when adding messages to the outbox', async () => {
      const outboxError = new Error('Outbox error');
      mockOutboxService.addMessage.mockRejectedValue(outboxError);

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('Error creating user');
      expect(result.getErrorValue()).toContain('Outbox error');
    });
  });
});
