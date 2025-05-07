import { Password } from './password';

describe('Password', () => {
  it('should create a valid password successfully', () => {
    const passwordOrError = Password.create('StrongP4ssword');

    expect(passwordOrError.isSuccess).toBe(true);
    expect(passwordOrError.getValue().value).toBe('StrongP4ssword');
    expect(passwordOrError.getValue().isHashed).toBe(false);
  });

  it('should create a valid hashed password', () => {
    const hashedPassword = '$2b$10$abcdefghijklmnopqrstuvwxyz012345';
    const passwordOrError = Password.create(hashedPassword, true);

    expect(passwordOrError.isSuccess).toBe(true);
    expect(passwordOrError.getValue().value).toBe(hashedPassword);
    expect(passwordOrError.getValue().isHashed).toBe(true);
  });

  it('should fail when password is empty', () => {
    const passwordOrError = Password.create('');

    expect(passwordOrError.isFailure).toBe(true);
    expect(passwordOrError.getErrorValue()).toBe('Password cannot be empty');
  });

  it('should fail when password is too short', () => {
    const passwordOrError = Password.create('Short1');

    expect(passwordOrError.isFailure).toBe(true);
    expect(passwordOrError.getErrorValue()).toContain('Password must be at least 8 characters');
  });

  it('should fail when password has no uppercase letters', () => {
    const passwordOrError = Password.create('password123');

    expect(passwordOrError.isFailure).toBe(true);
    expect(passwordOrError.getErrorValue()).toContain('Password must be at least 8 characters');
  });

  it('should fail when password has no lowercase letters', () => {
    const passwordOrError = Password.create('PASSWORD123');

    expect(passwordOrError.isFailure).toBe(true);
    expect(passwordOrError.getErrorValue()).toContain('Password must be at least 8 characters');
  });

  it('should fail when password has no numbers', () => {
    const passwordOrError = Password.create('PasswordNoNumbers');

    expect(passwordOrError.isFailure).toBe(true);
    expect(passwordOrError.getErrorValue()).toContain('Password must be at least 8 characters');
  });

  it('should hash a password correctly', async () => {
    const passwordOrError = Password.create('StrongP4ssword');
    const password = passwordOrError.getValue();

    const hashedPassword = await Password.hashPassword(password);

    expect(hashedPassword.isHashed).toBe(true);
    expect(hashedPassword.value).not.toBe('StrongP4ssword');
  });

  it('should correctly compare a password with its hash', async () => {
    const passwordOrError = Password.create('StrongP4ssword');
    const password = passwordOrError.getValue();

    const hashedPassword = await Password.hashPassword(password);

    expect(await hashedPassword.comparePassword('StrongP4ssword')).toBe(true);
    expect(await hashedPassword.comparePassword('WrongPassword')).toBe(false);
  });

  it('should correctly compare two equal password value objects', () => {
    const password1 = Password.create('StrongP4ssword').getValue();
    const password2 = Password.create('StrongP4ssword').getValue();

    expect(password1.equals(password2)).toBe(true);
  });

  it('should correctly compare two different password value objects', () => {
    const password1 = Password.create('StrongP4ssword').getValue();
    const password2 = Password.create('DifferentP4ssword').getValue();

    expect(password1.equals(password2)).toBe(false);
  });

  it('should compare plaintext passwords correctly when not hashed', async () => {
    const passwordOrError = Password.create('StrongP4ssword');
    const password = passwordOrError.getValue();

    expect(await password.comparePassword('StrongP4ssword')).toBe(true);

    expect(await password.comparePassword('DifferentP4ssword')).toBe(false);
  });

  it('should not re-hash an already hashed password', async () => {
    const hashedValue = '$2b$10$abcdefghijklmnopqrstuvwxyz012345';
    const passwordOrError = Password.create(hashedValue, true);
    const password = passwordOrError.getValue();

    const rehashed = await Password.hashPassword(password);

    expect(rehashed.value).toBe(hashedValue);
    expect(rehashed.isHashed).toBe(true);
  });
});
