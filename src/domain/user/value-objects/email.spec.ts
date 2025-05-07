import { Email } from './email';

describe('Email', () => {
  it('should create a valid email successfully', () => {
    const emailOrError = Email.create('test@example.com');

    expect(emailOrError.isSuccess).toBe(true);
    expect(emailOrError.getValue().value).toBe('test@example.com');
  });

  it('should convert email to lowercase', () => {
    const emailOrError = Email.create('TEST@EXAMPLE.COM');

    expect(emailOrError.isSuccess).toBe(true);
    expect(emailOrError.getValue().value).toBe('test@example.com');
  });

  it('should fail when email is empty', () => {
    const emailOrError = Email.create('');

    expect(emailOrError.isFailure).toBe(true);
    expect(emailOrError.getErrorValue()).toBe('Email cannot be empty');
  });

  it('should fail when email is only whitespace', () => {
    const emailOrError = Email.create('   ');

    expect(emailOrError.isFailure).toBe(true);
    expect(emailOrError.getErrorValue()).toBe('Email cannot be empty');
  });

  it('should fail when email has invalid format - missing @', () => {
    const emailOrError = Email.create('testexample.com');

    expect(emailOrError.isFailure).toBe(true);
    expect(emailOrError.getErrorValue()).toBe('Email format is invalid');
  });

  it('should fail when email has invalid format - missing domain', () => {
    const emailOrError = Email.create('test@');

    expect(emailOrError.isFailure).toBe(true);
    expect(emailOrError.getErrorValue()).toBe('Email format is invalid');
  });

  it('should fail when email has invalid format - missing TLD', () => {
    const emailOrError = Email.create('test@example');

    expect(emailOrError.isFailure).toBe(true);
    expect(emailOrError.getErrorValue()).toBe('Email format is invalid');
  });

  it('should correctly compare two equal email value objects', () => {
    const email1 = Email.create('test@example.com').getValue();
    const email2 = Email.create('test@example.com').getValue();

    expect(email1.equals(email2)).toBe(true);
  });

  it('should correctly compare two different email value objects', () => {
    const email1 = Email.create('test1@example.com').getValue();
    const email2 = Email.create('test2@example.com').getValue();

    expect(email1.equals(email2)).toBe(false);
  });
});
