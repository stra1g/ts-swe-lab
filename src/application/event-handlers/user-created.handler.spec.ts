import { UserCreatedEventHandler } from '../../application/event-handlers/user-created.handler';
import { UserCreatedEvent } from '../../domain/user/events/user-created.event';

describe('UserCreatedEventHandler', () => {
  let handler: UserCreatedEventHandler;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    handler = new UserCreatedEventHandler();
    consoleSpy = jest.spyOn(console, 'info').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log user creation information when handling UserCreatedEvent', async () => {
    // Arrange
    const mockEvent: UserCreatedEvent = {
      eventId: 'test-event-id',
      eventName: 'UserCreatedEvent',
      occurredOn: new Date(),
      userId: 'user-123',
      email: 'test@example.com',
      username: 'testuser',
      name: 'testname',
    };

    // Act
    await handler.handle(mockEvent);

    // Assert
    expect(consoleSpy).toHaveBeenCalledTimes(1);
  });
});
