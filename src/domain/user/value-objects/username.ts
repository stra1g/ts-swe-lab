import { ValueObject } from '../../common/value-object';
import { Result } from '../../common/result';

interface UsernameProps {
  value: string;
}

export class Username extends ValueObject<UsernameProps> {
  private constructor(props: UsernameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidUsername(username: string): boolean {
    // Username must be 3-30 characters, alphanumeric with underscores and hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/;
    return usernameRegex.test(username);
  }

  public static create(username: string): Result<Username> {
    if (!username || username.trim().length === 0) {
      return Result.fail<Username>('Username cannot be empty');
    }

    if (!this.isValidUsername(username))
      return Result.fail<Username>(
        'Username must be 3-30 characters and can only contain letters, numbers, underscores, and hyphens'
      );

    return Result.ok<Username>(new Username({ value: username }));
  }
}
