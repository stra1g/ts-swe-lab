import { ValueObject } from './value-object';

// Test implementation of the abstract class
class TestValueObject extends ValueObject<{ key: string }> {
  constructor(props: { key: string }) {
    super(props);
  }

  get key(): string {
    return this.props.key;
  }
}

describe('ValueObject', () => {
  it('should create a value object with frozen props', () => {
    const props = { key: 'test-value' };
    const valueObject = new TestValueObject(props);

    expect(valueObject.key).toBe('test-value');
    expect(Object.isFrozen(valueObject['props'])).toBe(true);
  });

  it('should determine equality correctly', () => {
    const vo1 = new TestValueObject({ key: 'same-value' });
    const vo2 = new TestValueObject({ key: 'same-value' });
    const vo3 = new TestValueObject({ key: 'different-value' });

    expect(vo1.equals(vo2)).toBe(true);
    expect(vo1.equals(vo3)).toBe(false);
  });

  describe('equals method edge cases', () => {
    let vo: TestValueObject;

    beforeEach(() => {
      vo = new TestValueObject({ key: 'test-value' });
    });

    // Test case 1: null and undefined comparisons
    it('should return false when comparing with null or undefined', () => {
      expect(vo.equals(null as any)).toBe(false);
      expect(vo.equals(undefined)).toBe(false);
    });

    // Test case 2: objects without props
    it('should return false when comparing with non-value objects', () => {
      const fakeVo = { equals: () => true } as any;
      expect(vo.equals(fakeVo)).toBe(false);
    });

    // Test case 3: explicit undefined props
    it('should return false when comparing with an object with undefined props', () => {
      const withUndefinedProps = { props: undefined } as any;
      expect(vo.equals(withUndefinedProps)).toBe(false);
    });
  });
});
