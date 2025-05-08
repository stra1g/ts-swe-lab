import { randomUUID } from 'node:crypto';
import { BaseDomainEvent } from './domain-event';

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn().mockReturnValue('test-uuid-123'),
}));

class TestEvent extends BaseDomainEvent {
  constructor(public readonly data: string) {
    super();
  }
}

describe('BaseDomainEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with a UUID', () => {
    const event = new TestEvent('test data');
    expect(event.eventId).toBe('test-uuid-123');
    expect(randomUUID).toHaveBeenCalledTimes(1);
  });

  it('should set occurredOn to a Date object', () => {
    const event = new TestEvent('test data');
    expect(event.occurredOn).toBeInstanceOf(Date);
  });

  it('should set eventName to the class name', () => {
    const event = new TestEvent('test data');
    expect(event.eventName).toBe('TestEvent');
  });

  it('should preserve additional properties from concrete implementations', () => {
    const event = new TestEvent('test data');
    expect(event.data).toBe('test data');
  });

  it('should implement the DomainEvent interface', () => {
    const event = new TestEvent('test data');
    expect(event).toHaveProperty('eventId');
    expect(event).toHaveProperty('occurredOn');
    expect(event).toHaveProperty('eventName');
  });
});
