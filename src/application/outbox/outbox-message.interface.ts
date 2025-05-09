/**
 * Represents a message in the outbox queue
 */
export interface OutboxMessage {
  id: string;
  aggregateId: string;
  aggregateType: string;
  eventType: string;
  payload: string; // JSON serialized event data
  createdAt: Date;
  processedAt?: Date;
  error?: string;
}
