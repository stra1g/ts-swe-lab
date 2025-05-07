import { Email } from './value-objects/email';
import { Username } from './value-objects/username';
import { Password } from './value-objects/password';
import { Name } from './value-objects/name';
import { Result } from '../common/result';
import { randomUUID } from 'node:crypto';

interface UserProps {
  id?: string;
  email: Email;
  username: Username;
  password: Password;
  name: Name;
  version?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  private readonly _id: string;
  private _email: Email;
  private _username: Username;
  private _password: Password;
  private _name: Name;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _version: number;

  private constructor(props: UserProps) {
    this._id = props.id || randomUUID();
    this._email = props.email;
    this._username = props.username;
    this._password = props.password;
    this._name = props.name;
    this._createdAt = props.createdAt || new Date();
    this._updatedAt = props.updatedAt || new Date();
    this._version = props.version || 0;
  }

  get id(): string {
    return this._id;
  }

  get email(): Email {
    return this._email;
  }

  get username(): Username {
    return this._username;
  }

  get password(): Password {
    return this._password;
  }

  get name(): Name {
    return this._name;
  }

  get version(): number {
    return this._version;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private updated(): void {
    this._updatedAt = new Date();
    this._version++;
  }

  public changeEmail(email: Email): Result<void> {
    this._email = email;
    this.updated();
    return Result.ok<void>();
  }

  public changeUsername(username: Username): Result<void> {
    this._username = username;
    this.updated();
    return Result.ok<void>();
  }

  public changeName(name: Name): Result<void> {
    this._name = name;
    this.updated();
    return Result.ok<void>();
  }

  public changePassword(password: Password): Result<void> {
    this._password = password;
    this.updated();
    return Result.ok<void>();
  }

  public static create(props: UserProps): Result<User> {
    return Result.ok<User>(new User(props));
  }
}
