import { OutboxProcessor } from './outbox-processor';
import { DomainEventHandler } from '../../domain/common/domain-event';
import { OutboxService } from '../../application/outbox/outbox-service.interface';

describe('OutboxProcessor', () => {
  let outboxProcessor: OutboxProcessor;
  let mockOutboxService: jest.Mocked<OutboxService>;
  let mockEventHandler: jest.Mocked<DomainEventHandler<any>>;

  beforeEach(() => {
    mockOutboxService = {
      getUnprocessedMessages: jest.fn(),
      markAsProcessed: jest.fn(),
      markAsFailed: jest.fn(),
    } as any;

    mockEventHandler = {
      handle: jest.fn(),
    };

    outboxProcessor = new OutboxProcessor(mockOutboxService);
  });

  describe('registerEventHandler', () => {
    it('should register an event handler for a specific event type', async () => {
      outboxProcessor.registerEventHandler('TestEvent', mockEventHandler);

      mockOutboxService.getUnprocessedMessages.mockResolvedValue([
        {
          aggregateId: 'test-event-id',
          aggregateType: 'TestEvent',
          createdAt: new Date(),
          id: '1',
          eventType: 'TestEvent',
          payload: JSON.stringify({
            eventId: 'event-1',
            eventName: 'TestEvent',
            occurredOn: new Date().toISOString(),
          }),
        },
      ]);

      return outboxProcessor.processBatch().then(() => {
        expect(mockEventHandler.handle).toHaveBeenCalled();
      });
    });
  });

  describe('processBatch', () => {
    it('should process a batch of messages and return the count of processed messages', async () => {
      const mockMessages = [
        {
          aggregateId: 'test-event-id',
          aggregateType: 'TestEvent',
          createdAt: new Date(),
          id: '1',
          eventType: 'TestEvent',
          payload: JSON.stringify({
            eventId: 'event-1',
            eventName: 'TestEvent',
            occurredOn: new Date().toISOString(),
          }),
        },
        {
          aggregateId: 'test-event-id',
          aggregateType: 'TestEvent',
          createdAt: new Date(),
          id: '2',
          eventType: 'TestEvent',
          payload: JSON.stringify({
            eventId: 'event-2',
            eventName: 'TestEvent',
            occurredOn: new Date().toISOString(),
          }),
        },
      ];

      mockOutboxService.getUnprocessedMessages.mockResolvedValue(mockMessages);
      outboxProcessor.registerEventHandler('TestEvent', mockEventHandler);

      const processedCount = await outboxProcessor.processBatch();

      expect(processedCount).toBe(2);
      expect(mockOutboxService.getUnprocessedMessages).toHaveBeenCalledWith(10);
      expect(mockEventHandler.handle).toHaveBeenCalledTimes(2);
      expect(mockOutboxService.markAsProcessed).toHaveBeenCalledTimes(2);
    });

    it('should skip processing if already processing', async () => {
      (outboxProcessor as any).isProcessing = true;

      const processedCount = await outboxProcessor.processBatch();

      expect(processedCount).toBe(0);
      expect(mockOutboxService.getUnprocessedMessages).not.toHaveBeenCalled();
    });

    it('should warn and skip when no handler is registered for an event type', async () => {
      const mockMessages = [
        {
          aggregateId: 'test-event-id',
          aggregateType: 'TestEvent',
          createdAt: new Date(),
          id: '1',
          eventType: 'UnknownEvent',
          payload: JSON.stringify({
            eventId: 'event-1',
            eventName: 'UnknownEvent',
            occurredOn: new Date().toISOString(),
          }),
        },
      ];

      mockOutboxService.getUnprocessedMessages.mockResolvedValue(mockMessages);

      const processedCount = await outboxProcessor.processBatch();

      expect(processedCount).toBe(1);
      expect(mockOutboxService.markAsProcessed).toHaveBeenCalledWith('1');
    });

    it('should handle processing errors and mark messages as failed', async () => {
      const mockMessages = [
        {
          aggregateId: 'test-event-id',
          aggregateType: 'TestEvent',
          createdAt: new Date(),
          id: '1',
          eventType: 'TestEvent',
          payload: JSON.stringify({
            eventId: 'event-1',
            eventName: 'TestEvent',
            occurredOn: new Date().toISOString(),
          }),
        },
      ];

      const error = new Error('Test error');
      mockOutboxService.getUnprocessedMessages.mockResolvedValue(mockMessages);
      outboxProcessor.registerEventHandler('TestEvent', mockEventHandler);
      mockEventHandler.handle.mockRejectedValue(error);

      const processedCount = await outboxProcessor.processBatch();

      expect(processedCount).toBe(0);
      expect(mockOutboxService.markAsFailed).toHaveBeenCalledWith('1', 'Test error');
    });

    it('should handle non-Error objects thrown during processing', async () => {
      const mockMessages = [
        {
          aggregateId: 'test-event-id',
          aggregateType: 'TestEvent',
          createdAt: new Date(),
          id: '1',
          eventType: 'TestEvent',
          payload: JSON.stringify({
            eventId: 'event-1',
            eventName: 'TestEvent',
            occurredOn: new Date().toISOString(),
          }),
        },
      ];

      mockOutboxService.getUnprocessedMessages.mockResolvedValue(mockMessages);
      outboxProcessor.registerEventHandler('TestEvent', mockEventHandler);
      mockEventHandler.handle.mockRejectedValue('string error');

      await outboxProcessor.processBatch();

      expect(mockOutboxService.markAsFailed).toHaveBeenCalledWith('1', 'string error');
    });

    it('should handle errors in the outbox service', async () => {
      const error = new Error('Service error');
      mockOutboxService.getUnprocessedMessages.mockRejectedValue(error);

      const processedCount = await outboxProcessor.processBatch();

      expect(processedCount).toBe(0);
    });
  });
});
