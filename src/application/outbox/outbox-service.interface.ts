import { DomainEvent } from '../../domain/common/domain-event';
import { OutboxMessage } from './outbox-message.interface';

/**
 * The OutboxService is responsible for storing domain events in the outbox
 * to be processed asynchronously, ensuring reliable event publishing.
 */
export interface OutboxService {
  /**
   * Add a domain event to the outbox
   * @param event The domain event to add
   * @param aggregateId The ID of the aggregate that produced the event
   * @param aggregateType The type of the aggregate
   */
  addMessage(event: DomainEvent, aggregateId: string, aggregateType: string): Promise<void>;

  /**
   * Get unprocessed messages from the outbox
   * @param limit Maximum number of messages to retrieve
   */
  getUnprocessedMessages(limit?: number): Promise<OutboxMessage[]>;

  /**
   * Mark a message as processed
   * @param id The ID of the message to mark as processed
   */
  markAsProcessed(id: string): Promise<void>;

  /**
   * Mark a message as failed with an error
   * @param id The ID of the message
   * @param error The error that occurred
   */
  markAsFailed(id: string, error: string): Promise<void>;
}
