/**
 * The OutboxProcessor is responsible for processing messages in the outbox
 * and dispatching them to the appropriate event handlers.
 */
export interface OutboxProcessorInterface {
  /**
   * Process a batch of messages from the outbox
   * @param batchSize Maximum number of messages to process in one batch
   */
  processBatch(batchSize?: number): Promise<number>;
}
