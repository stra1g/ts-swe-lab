import { Result } from './result';

describe('Result', () => {
  describe('Success results', () => {
    it('should create a success result', () => {
      const result = Result.ok<string>('success value');

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.getValue()).toBe('success value');
    });

    it('should create a success result with undefined value', () => {
      const result = Result.ok<string>();

      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(() => result.getValue()).toThrow();
    });

    it('should throw when creating a success result with an error', () => {
      expect(() => {
        // @ts-ignore: Testing invalid arguments
        new Result(true, 'some error', 'some value');
      }).toThrow('InvalidOperation: A result cannot be successful and contain an error');
    });
  });

  describe('Failure results', () => {
    it('should create a failure result', () => {
      const result = Result.fail<string>('error message');

      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.getErrorValue()).toBe('error message');
      expect(() => result.getValue()).toThrow();
    });

    it('should throw when creating a failure result without an error message', () => {
      expect(() => {
        // @ts-ignore: Testing invalid arguments
        new Result(false, undefined, 'some value');
      }).toThrow('InvalidOperation: A failing result needs to contain an error message');
    });
  });

  describe('combine', () => {
    it('should return first failure when combining results with failures', () => {
      const results = [Result.ok('success 1'), Result.fail('error 1'), Result.fail('error 2')];

      const combined = Result.combine(results);

      expect(combined.isFailure).toBe(true);
      expect(combined.getErrorValue()).toBe('error 1');
    });

    it('should return success when all results are successful', () => {
      const results = [Result.ok('success 1'), Result.ok('success 2'), Result.ok('success 3')];

      const combined = Result.combine(results);

      expect(combined.isSuccess).toBe(true);
    });

    it('should handle empty array', () => {
      const combined = Result.combine([]);

      expect(combined.isSuccess).toBe(true);
    });
  });

  describe('getValue', () => {
    it('should throw with the error message when trying to get value from a failure result', () => {
      const result = Result.fail<string>('custom error');

      expect(() => result.getValue()).toThrow(/custom error/);
    });
  });

  describe('getErrorValue', () => {
    it('should return "Unknown error" when error is undefined', () => {
      const result = Result.ok<string>('value');

      expect(result.getErrorValue()).toBe('Unknown error');
    });
  });
});
