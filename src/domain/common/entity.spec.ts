import { Entity, BaseEntityProps } from './entity'; // Adjust the import path as needed
import { randomUUID } from 'node:crypto';

// Mock randomUUID to make tests deterministic
jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(),
}));

// Create a concrete implementation of the abstract Entity class for testing
interface TestEntityProps {
  name: string;
  value: number;
}

class TestEntity extends Entity<TestEntityProps> {
  constructor(props: TestEntityProps, id?: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get value(): number {
    return this.props.value;
  }

  // Expose the protected method for testing
  public updateEntity(): void {
    this.updated();
  }

  // Expose the protected method for testing
  public deleteEntity(): void {
    this.delete();
  }
}

describe('Entity', () => {
  const mockUUID = '123e4567-e89b-12d3-a456-426614174000';
  let entity: TestEntity;
  let initialProps: TestEntityProps;

  beforeEach(() => {
    // Set up the mock implementation for each test
    (randomUUID as jest.Mock).mockReturnValue(mockUUID);

    // Initialize test props
    initialProps = {
      name: 'Test Entity',
      value: 42,
    };

    // Create a new entity for each test
    entity = new TestEntity(initialProps);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create an entity with default BaseEntityProps when not provided', () => {
      expect(entity.id).toBe(mockUUID);
      expect(entity.name).toBe(initialProps.name);
      expect(entity.value).toBe(initialProps.value);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
      expect(entity.version).toBe(0);
      expect(entity.isDeleted).toBe(false);
      expect(entity.deletedAt).toBeNull();
    });

    it('should generate random UUID when ID is not provided', () => {
      expect(entity.id).toBe(mockUUID);
      expect(randomUUID).toHaveBeenCalledTimes(1);
    });
  });

  describe('getters', () => {
    it('should return id correctly', () => {
      expect(entity.id).toBe(mockUUID);
    });

    it('should return createdAt correctly', () => {
      expect(entity.createdAt).toBeInstanceOf(Date);
    });

    it('should return updatedAt correctly', () => {
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should return version correctly', () => {
      expect(entity.version).toBe(0);
    });

    it('should return isDeleted correctly', () => {
      expect(entity.isDeleted).toBe(false);
    });

    it('should return deletedAt correctly', () => {
      expect(entity.deletedAt).toBeNull();
    });

    it('should return custom props correctly', () => {
      expect(entity.name).toBe(initialProps.name);
      expect(entity.value).toBe(initialProps.value);
    });
  });

  describe('updated method', () => {
    it('should increment version and update the updatedAt timestamp', () => {
      const originalUpdatedAt = entity.updatedAt;
      const originalVersion = entity.version;

      // Wait a small amount of time to ensure the Date is different
      jest.advanceTimersByTime(100);

      entity.updateEntity();

      expect(entity.version).toBe(originalVersion + 1);
      expect(entity.updatedAt).not.toBe(originalUpdatedAt);
      expect(entity.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('delete functionality', () => {
    it('should mark entity as deleted and set deletedAt date', () => {
      expect(entity.isDeleted).toBe(false);
      expect(entity.deletedAt).toBeNull();

      entity.deleteEntity();

      expect(entity.isDeleted).toBe(true);
      expect(entity.deletedAt).toBeInstanceOf(Date);
      expect(entity.version).toBe(1); // Verify the updated method was called
    });
  });
});
