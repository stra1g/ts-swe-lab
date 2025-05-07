import { ValueObject } from '../../common/value-object';
import { Result } from '../../common/result';
import * as bcrypt from 'bcrypt';

interface PasswordProps {
  value: string;
  hashed?: boolean;
}

export class Password extends ValueObject<PasswordProps> {
  private constructor(props: PasswordProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  get isHashed(): boolean {
    return this.props.hashed || false;
  }

  private static isValidPassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;
    return passwordRegex.test(password);
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    if (this.isHashed) return await bcrypt.compare(plainTextPassword, this.props.value);

    return this.props.value === plainTextPassword;
  }

  public static async hashPassword(password: Password): Promise<Password> {
    if (password.isHashed) return password;

    const hashedPassword = await bcrypt.hash(password.props.value, 10);
    return new Password({ value: hashedPassword, hashed: true });
  }

  public static create(password: string, hashed: boolean = false): Result<Password> {
    if (!password || password.length === 0)
      return Result.fail<Password>('Password cannot be empty');

    if (!hashed && !this.isValidPassword(password))
      return Result.fail<Password>(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number'
      );

    return Result.ok<Password>(new Password({ value: password, hashed }));
  }
}
