import { BaseDomainEvent } from '../../common/domain-event';

export class UserCreatedEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly username: string,
    public readonly name: string
  ) {
    super();
  }
}
