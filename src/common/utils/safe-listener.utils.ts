import { Logger } from '@nestjs/common';

const logger = new Logger('EventListenerError');

export async function safeListener(
  listenerName: string,
  eventName: string,
  fn: () => Promise<void> | void,
): Promise<void> {
    try {
        await fn()
    } catch (error) {
        const err = error as Error
        logger.log(`Listener ${listenerName} failed while handling requesting ${eventName}: ${err.message}`)

        // I will can sentry or datadog here
    }
}
