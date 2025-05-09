import { User } from './user';
import { Email } from './value-objects/email';
import { Username } from './value-objects/username';
import { Password } from './value-objects/password';
import { Name } from './value-objects/name';

describe('User', () => {
  const validEmail = Email.create('test@example.com').getValue();
  const validUsername = Username.create('testuser').getValue();
  const validPassword = Password.create('StrongP4ssword').getValue();
  const validName = Name.create('John Doe').getValue();

  it('should create a valid user successfully', () => {
    const userOrError = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    });

    expect(userOrError.isSuccess).toBe(true);

    const user = userOrError.getValue();
    expect(user.id).toBeDefined();
    expect(user.email).toBe(validEmail);
    expect(user.username).toBe(validUsername);
    expect(user.password).toBe(validPassword);
    expect(user.name).toBe(validName);
    expect(user.version).toBe(0);
  });

  it('should change email successfully', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const newEmail = Email.create('new@example.com').getValue();
    const result = user.changeEmail(newEmail);

    expect(result.isSuccess).toBe(true);
    expect(user.email).toBe(newEmail);
    expect(user.version).toBe(1);
  });

  it('should change username successfully', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const newUsername = Username.create('newusername').getValue();
    const result = user.changeUsername(newUsername);

    expect(result.isSuccess).toBe(true);
    expect(user.username).toBe(newUsername);
    expect(user.version).toBe(1);
  });

  it('should change name successfully', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const newName = Name.create('Jane Doe').getValue();
    const result = user.changeName(newName);

    expect(result.isSuccess).toBe(true);
    expect(user.name).toBe(newName);
    expect(user.version).toBe(1);
  });

  it('should change password successfully', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const newPassword = Password.create('NewStrongP4ss').getValue();
    const result = user.changePassword(newPassword);

    expect(result.isSuccess).toBe(true);
    expect(user.password).toBe(newPassword);
    expect(user.version).toBe(1);
  });

  it('should increment version on each update', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    user.changeEmail(Email.create('new@example.com').getValue());
    expect(user.version).toBe(1);

    user.changeUsername(Username.create('newusername').getValue());
    expect(user.version).toBe(2);

    user.changeName(Name.create('Jane Doe').getValue());
    expect(user.version).toBe(3);

    user.changePassword(Password.create('NewStrongP4ss').getValue());
    expect(user.version).toBe(4);
  });

  it('should call updated() when changing email', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const updatedSpy = jest.spyOn(user as any, 'updated');

    user.changeEmail(Email.create('different@example.com').getValue());

    expect(updatedSpy).toHaveBeenCalled();
  });

  it('should call updated() when changing username', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const updatedSpy = jest.spyOn(user as any, 'updated');

    user.changeUsername(Username.create('differentuser').getValue());

    expect(updatedSpy).toHaveBeenCalled();
  });

  it('should call updated() when changing name', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const updatedSpy = jest.spyOn(user as any, 'updated');

    user.changeName(Name.create('Different Name').getValue());

    expect(updatedSpy).toHaveBeenCalled();
  });

  it('should call updated() when changing password', () => {
    const user = User.create({
      email: validEmail,
      username: validUsername,
      password: validPassword,
      name: validName,
    }).getValue();

    const updatedSpy = jest.spyOn(user as any, 'updated');

    user.changePassword(Password.create('D1fferentP@ssword', false).getValue());

    expect(updatedSpy).toHaveBeenCalled();
  });
});
