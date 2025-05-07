import { Username } from './username';

describe('Username', () => {
  it('should create a valid username successfully', () => {
    const usernameOrError = Username.create('validuser');

    expect(usernameOrError.isSuccess).toBe(true);
    expect(usernameOrError.getValue().value).toBe('validuser');
  });

  it('should accept usernames with allowed special characters', () => {
    const usernameOrError = Username.create('valid_user-123');

    expect(usernameOrError.isSuccess).toBe(true);
    expect(usernameOrError.getValue().value).toBe('valid_user-123');
  });

  it('should accept usernames with minimum length (3 characters)', () => {
    const usernameOrError = Username.create('abc');

    expect(usernameOrError.isSuccess).toBe(true);
  });

  it('should accept usernames with maximum length (30 characters)', () => {
    const username = 'abcdefghijklmnopqrstuvwxyz1234';
    expect(username.length).toBe(30);

    const usernameOrError = Username.create(username);

    expect(usernameOrError.isSuccess).toBe(true);
  });

  it('should fail when username is empty', () => {
    const usernameOrError = Username.create('');

    expect(usernameOrError.isFailure).toBe(true);
    expect(usernameOrError.getErrorValue()).toBe('Username cannot be empty');
  });

  it('should fail when username is only whitespace', () => {
    const usernameOrError = Username.create('   ');

    expect(usernameOrError.isFailure).toBe(true);
    expect(usernameOrError.getErrorValue()).toBe('Username cannot be empty');
  });

  it('should fail when username is too short (less than 3 characters)', () => {
    const usernameOrError = Username.create('ab');

    expect(usernameOrError.isFailure).toBe(true);
    expect(usernameOrError.getErrorValue()).toContain('Username must be 3-30 characters');
  });

  it('should fail when username is too long (more than 30 characters)', () => {
    const username = 'abcdefghijklmnopqrstuvwxyz12345'; // 31 characters
    expect(username.length).toBe(31);

    const usernameOrError = Username.create(username);

    expect(usernameOrError.isFailure).toBe(true);
    expect(usernameOrError.getErrorValue()).toContain('Username must be 3-30 characters');
  });

  it('should fail when username contains invalid characters', () => {
    const usernameOrError = Username.create('invalid@user');

    expect(usernameOrError.isFailure).toBe(true);
    expect(usernameOrError.getErrorValue()).toContain('Username must be 3-30 characters');
  });

  it('should fail when username contains spaces', () => {
    const usernameOrError = Username.create('invalid user');

    expect(usernameOrError.isFailure).toBe(true);
    expect(usernameOrError.getErrorValue()).toContain('Username must be 3-30 characters');
  });

  it('should correctly compare two equal username value objects', () => {
    const username1 = Username.create('testuser').getValue();
    const username2 = Username.create('testuser').getValue();

    expect(username1.equals(username2)).toBe(true);
  });

  it('should correctly compare two different username value objects', () => {
    const username1 = Username.create('testuser1').getValue();
    const username2 = Username.create('testuser2').getValue();

    expect(username1.equals(username2)).toBe(false);
  });
});
