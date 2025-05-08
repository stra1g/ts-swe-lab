import { randomUUID } from 'node:crypto';

export interface DomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;
}

export abstract class BaseDomainEvent implements DomainEvent {
  public readonly eventId: string;
  public readonly occurredOn: Date;
  public readonly eventName: string;

  protected constructor() {
    this.eventId = randomUUID();
    this.occurredOn = new Date();
    this.eventName = this.constructor.name;
  }
}
