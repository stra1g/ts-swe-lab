import { BaseDomainEvent } from '../../common/domain-event';
import { Email } from '../value-objects/email';
import { Username } from '../value-objects/username';
import { Name } from '../value-objects/name';

export class UserCreatedEvent extends BaseDomainEvent {
  constructor(
    public readonly userId: string,
    public readonly email: Email,
    public readonly username: Username,
    public readonly name: Name
  ) {
    super();
  }
}
