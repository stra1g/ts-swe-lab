import { Name } from './name';

describe('Name', () => {
  it('should create a valid name successfully', () => {
    const nameOrError = Name.create('John Doe');

    expect(nameOrError.isSuccess).toBe(true);
    expect(nameOrError.getValue().value).toBe('John Doe');
  });

  it('should trim whitespace from name', () => {
    const nameOrError = Name.create('  John Doe  ');

    expect(nameOrError.isSuccess).toBe(true);
    expect(nameOrError.getValue().value).toBe('John Doe');
  });

  it('should fail when name is empty', () => {
    const nameOrError = Name.create('');

    expect(nameOrError.isFailure).toBe(true);
    expect(nameOrError.getErrorValue()).toBe('Name cannot be empty');
  });

  it('should fail when name is only whitespace', () => {
    const nameOrError = Name.create('   ');

    expect(nameOrError.isFailure).toBe(true);
    expect(nameOrError.getErrorValue()).toBe('Name cannot be empty');
  });

  it('should fail when name is too short', () => {
    const nameOrError = Name.create('J');

    expect(nameOrError.isFailure).toBe(true);
    expect(nameOrError.getErrorValue()).toBe('Name must be between 2 and 100 characters');
  });

  it('should fail when name is too long', () => {
    const longName = 'A'.repeat(101);
    const nameOrError = Name.create(longName);

    expect(nameOrError.isFailure).toBe(true);
    expect(nameOrError.getErrorValue()).toBe('Name must be between 2 and 100 characters');
  });

  it('should correctly compare two equal name value objects', () => {
    const name1 = Name.create('John Doe').getValue();
    const name2 = Name.create('John Doe').getValue();

    expect(name1.equals(name2)).toBe(true);
  });

  it('should correctly compare two different name value objects', () => {
    const name1 = Name.create('John Doe').getValue();
    const name2 = Name.create('Jane Doe').getValue();

    expect(name1.equals(name2)).toBe(false);
  });
});
