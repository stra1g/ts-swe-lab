import { AggregateRoot } from './aggregate-root';
import { BaseDomainEvent } from './domain-event';

interface TestProps {}

class TestEvent extends BaseDomainEvent {
  constructor(public readonly data: string) {
    super();
  }
}

class TestAggregate extends AggregateRoot<TestProps> {
  constructor(props: TestProps) {
    super(props);
  }

  public addTestEvent(data: string): void {
    this.addDomainEvent(new TestEvent(data));
  }
}

describe('AggregateRoot', () => {
  it('should initialize with empty domain events', () => {
    const aggregate = new TestAggregate('test-id');

    expect(aggregate.domainEvents).toEqual([]);
  });

  it('should add domain events', () => {
    const aggregate = new TestAggregate('test-id');

    aggregate.addTestEvent('test-data');

    expect(aggregate.domainEvents.length).toBe(1);
    expect(aggregate.domainEvents[0]).toBeInstanceOf(TestEvent);
    expect((aggregate.domainEvents[0] as TestEvent).data).toBe('test-data');
  });

  it('should clear events', () => {
    const aggregate = new TestAggregate('test-id');

    aggregate.addTestEvent('test-data-1');
    aggregate.addTestEvent('test-data-2');
    expect(aggregate.domainEvents.length).toBe(2);

    aggregate.clearEvents();
    expect(aggregate.domainEvents.length).toBe(0);
  });
});
