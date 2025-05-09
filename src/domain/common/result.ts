export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  private readonly error: string | undefined;
  private readonly _value: T | undefined;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
    if (isSuccess && error)
      throw new Error('InvalidOperation: A result cannot be successful and contain an error');

    if (!isSuccess && !error)
      throw new Error('InvalidOperation: A failing result needs to contain an error message');

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess || this._value === undefined)
      throw new Error(`Can't get the value of an error result. Error: ${this.error}`);

    return this._value;
  }

  public getErrorValue(): string {
    return this.error || 'Unknown error';
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, undefined, value);
  }

  public static fail<U>(error: string): Result<U> {
    return new Result<U>(false, error);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok();
  }
}
