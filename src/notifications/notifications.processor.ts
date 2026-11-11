import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { ORDER_EVENTS } from '../orders/events/order-events.contants.js';
import { QUEUE_NAMES } from '../queues/queues.constants.js';

@Processor(QUEUE_NAMES.NOTIFICATIONS)
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) return;
    const event = job.data;

    this.logger.log(
      `Sending Confirmation Email ${event.orderId} to user ${event.userId} [attempts ${job.attemptsMade + 1}]`,
    );

    this.logger.log(
        `Confirmation Email Queued for order ${event.orderId} - total ${event.total.toFixed(2)}`,
    );
    
    await Promise.resolve(null);
  }
}
