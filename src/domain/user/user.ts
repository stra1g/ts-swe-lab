import { Email } from './value-objects/email';
import { Username } from './value-objects/username';
import { Password } from './value-objects/password';
import { Name } from './value-objects/name';
import { Result } from '../common/result';
import { AggregateRoot } from '../common/aggregate-root';
import { UserCreatedEvent } from './events/user-created.event';

interface UserProps {
  email: Email;
  username: Username;
  password: Password;
  name: Name;
}

export class User extends AggregateRoot<UserProps> {
  private constructor(props: UserProps) {
    super(props);
  }

  get id(): string {
    return this._id;
  }

  get email(): Email {
    return this.props.email;
  }

  get username(): Username {
    return this.props.username;
  }

  get password(): Password {
    return this.props.password;
  }

  get name(): Name {
    return this.props.name;
  }

  public changeEmail(email: Email): Result<void> {
    this.props.email = email;
    this.updated();
    return Result.ok<void>();
  }

  public changeUsername(username: Username): Result<void> {
    this.props.username = username;
    this.updated();
    return Result.ok<void>();
  }

  public changeName(name: Name): Result<void> {
    this.props.name = name;
    this.updated();
    return Result.ok<void>();
  }

  public changePassword(password: Password): Result<void> {
    this.props.password = password;
    this.updated();
    return Result.ok<void>();
  }

  public static create(props: UserProps): Result<User> {
    const user = new User(props);

    user.addDomainEvent(
      new UserCreatedEvent(user.id, user.email.value, user.username.value, user.name.value)
    );

    return Result.ok<User>(user);
  }
}
