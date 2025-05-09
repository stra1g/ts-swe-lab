import { ValueObject } from '../../common/value-object';
import { Result } from '../../common/result';

interface NameProps {
  value: string;
}

export class Name extends ValueObject<NameProps> {
  private constructor(props: NameProps) {
    super(props);
  }

  get value(): string {
    return this.props.value;
  }

  private static isValidName(name: string): boolean {
    return name.length >= 2 && name.length <= 100;
  }

  public static create(name: string): Result<Name> {
    if (!name || name.trim().length === 0) return Result.fail<Name>('Name cannot be empty');

    const trimmedName = name.trim();

    if (!this.isValidName(trimmedName))
      return Result.fail<Name>('Name must be between 2 and 100 characters');

    return Result.ok<Name>(new Name({ value: trimmedName }));
  }
}
