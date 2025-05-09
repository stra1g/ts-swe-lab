import { UserCreatedEvent } from '../../domain/user/events/user-created.event';
import { DomainEventHandler } from '../../domain/common/domain-event';

export class UserCreatedEventHandler implements DomainEventHandler<UserCreatedEvent> {
  /**
   * Handle the UserCreatedEvent
   * @param event The event to handle
   */
  async handle(event: UserCreatedEvent): Promise<void> {
    console.info(`User created: ${event.userId} (${event.email}) with username ${event.username}`);
  }
}
