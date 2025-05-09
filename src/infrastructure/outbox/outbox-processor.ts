import { DomainEvent, DomainEventHandler } from '../../domain/common/domain-event';
import { OutboxProcessorInterface } from '../../application/outbox/outbox-processor.interface';
import { OutboxService } from '../../application/outbox/outbox-service.interface';

export class OutboxProcessor implements OutboxProcessorInterface {
  private eventHandlerMap: Map<string, DomainEventHandler<any>> = new Map();
  private isProcessing = false;

  constructor(private readonly outboxService: OutboxService) {}

  /**
   * Register an event handler for a specific event type
   * @param eventType The type of event to register the handler for
   * @param handler The handler to register
   */
  registerEventHandler<T extends DomainEvent>(
    eventType: string,
    handler: DomainEventHandler<T>
  ): void {
    this.eventHandlerMap.set(eventType, handler);
  }

  /**
   * Process a batch of messages from the outbox
   * @param batchSize Maximum number of messages to process in one batch
   * @returns The number of messages processed
   */
  async processBatch(batchSize = 10): Promise<number> {
    if (this.isProcessing) {
      return 0;
    }

    this.isProcessing = true;
    let processedCount = 0;

    try {
      const messages = await this.outboxService.getUnprocessedMessages(batchSize);

      for (const message of messages) {
        try {
          const eventHandler = this.eventHandlerMap.get(message.eventType);

          if (!eventHandler) {
            console.warn(`No handler registered for event type: ${message.eventType}`);
            await this.outboxService.markAsProcessed(message.id);
            processedCount++;
            continue;
          }

          // Parse the event payload
          const eventData = JSON.parse(message.payload);

          // Create a domain event instance
          const event: DomainEvent = {
            eventId: eventData.eventId,
            eventName: eventData.eventName,
            occurredOn: new Date(eventData.occurredOn),
            ...eventData,
          };

          await eventHandler.handle(event);

          await this.outboxService.markAsProcessed(message.id);
          processedCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`Error processing outbox message ${message.id}: ${errorMessage}`);
          await this.outboxService.markAsFailed(message.id, errorMessage);
        }
      }
    } catch (error) {
      console.error('Error processing outbox batch:', error);
    } finally {
      this.isProcessing = false;
    }

    return processedCount;
  }
}
