import { CreateUserUseCase, CreateUserDto } from './create-user.use-case';
import { UnitOfWork } from '../unit-of-work/unit-of-work.interface';
import { OutboxService } from '../outbox/outbox-service.interface';
import { User } from '../../domain/user/user';
import { UserRepositoryInterface } from '../../domain/user/repositories/user-repository.interface';

describe('CreateUserUseCase', () => {
  const validDto: CreateUserDto = {
    email: 'test@example.com',
    username: 'testuser',
    password: 'StrongP4ssword',
    name: 'Test User',
  };

  let mockUnitOfWork: jest.Mocked<UnitOfWork>;
  let mockOutboxService: jest.Mocked<OutboxService>;
  let mockUserRepository: jest.Mocked<UserRepositoryInterface>;

  let createUserUseCase: CreateUserUseCase;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<UserRepositoryInterface>;

    mockUnitOfWork = {
      getUserRepository: jest.fn().mockReturnValue(mockUserRepository),
      execute: jest.fn().mockImplementation(async callback => await callback()),
      beginTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
    } as jest.Mocked<UnitOfWork>;

    mockOutboxService = {
      addMessage: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<OutboxService>;

    createUserUseCase = new CreateUserUseCase(mockUnitOfWork, mockOutboxService);
  });

  describe('execute', () => {
    it('should successfully create a user when all inputs are valid', async () => {
      const result = await createUserUseCase.execute(validDto);

      expect(result.isSuccess).toBe(true);
      expect(typeof result.getValue()).toBe('string');

      expect(mockUnitOfWork.execute).toHaveBeenCalled();
      expect(mockUserRepository.create).toHaveBeenCalled();
      expect(mockOutboxService.addMessage).toHaveBeenCalled();
    });

    it('should fail if value object creation fails (invalid email)', async () => {
      const invalidDto = { ...validDto, email: 'invalid-email' };

      const result = await createUserUseCase.execute(invalidDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('Email');
      expect(mockUnitOfWork.execute).not.toHaveBeenCalled();
    });

    it('should fail if user creation fails', async () => {
      const spy = jest.spyOn(User, 'create').mockReturnValueOnce({
        isFailure: true,
        isSuccess: false,
        getErrorValue: () => 'User creation error',
        getValue: () => {
          throw new Error('User creation error');
        },
      } as any);

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('User creation error');
      expect(mockUserRepository.create).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should handle exceptions from unit of work', async () => {
      mockUnitOfWork.execute.mockRejectedValueOnce(new Error('UoW failed'));

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('UoW failed');
    });

    it('should handle exceptions when adding message to outbox', async () => {
      mockOutboxService.addMessage.mockRejectedValueOnce(new Error('Outbox error'));

      const result = await createUserUseCase.execute(validDto);

      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toContain('Outbox error');
    });
  });
});
