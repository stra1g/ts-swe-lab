import { UnitOfWork } from '../unit-of-work/unit-of-work.interface';
import { OutboxService } from '../outbox/outbox-service.interface';
import { Email } from '../../domain/user/value-objects/email';
import { Username } from '../../domain/user/value-objects/username';
import { Password } from '../../domain/user/value-objects/password';
import { Name } from '../../domain/user/value-objects/name';
import { Result } from '../../domain/common/result';
import { User } from '../../domain/user/user';

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  name: string;
}

export class CreateUserUseCase {
  constructor(
    private readonly unitOfWork: UnitOfWork,
    private readonly outboxService: OutboxService
  ) {}

  /**
   * Creates a new user in the system
   * @param dto The user creation data transfer object
   */
  async execute(dto: CreateUserDto): Promise<Result<string>> {
    const emailOrError = Email.create(dto.email);
    const usernameOrError = Username.create(dto.username);
    const passwordOrError = Password.create(dto.password);
    const nameOrError = Name.create(dto.name);

    const valueObjectsResult = Result.combine([
      emailOrError,
      usernameOrError,
      passwordOrError,
      nameOrError,
    ]);

    if (valueObjectsResult.isFailure)
      return Result.fail<string>(valueObjectsResult.getErrorValue());

    const email = emailOrError.getValue();
    const username = usernameOrError.getValue();
    const password = passwordOrError.getValue();
    const name = nameOrError.getValue();

    try {
      return await this.unitOfWork.execute(async () => {
        const userRepository = this.unitOfWork.getUserRepository();

        const hashedPassword = await Password.hashPassword(password);

        const userOrError = User.create({
          email,
          username,
          password: hashedPassword,
          name,
        });

        if (userOrError.isFailure) return Result.fail<string>(userOrError.getErrorValue());

        const user = userOrError.getValue();

        await userRepository.create(user);

        for (const event of user.domainEvents)
          await this.outboxService.addMessage(event, user.id, User.name);

        user.clearEvents();

        return Result.ok<string>(user.id);
      });
    } catch (error) {
      return Result.fail<string>(
        `Error creating user: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
