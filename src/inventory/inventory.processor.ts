import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { ORDER_EVENTS } from '../orders/events/order-events.contants.js';
import { QUEUE_NAMES } from '../queues/queues.constants.js';

// @Processor(QUEUE_NAMES.ORDER_EVENTS)
@Processor(QUEUE_NAMES.INVENTORY, {
  stalledInterval: 5000,
  maxStalledCount: 2,
})
export class InventorProcessor extends WorkerHost {
  private readonly logger = new Logger(InventorProcessor.name);

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) return;

    const event = job.data;

    this.logger.log(
      `Reserving Stock for Order ${event.orderId} (${event.items.length}) item(s) [attempts ${job.attemptsMade + 1}]`,
    );

    await new Promise((resolve) => setTimeout(resolve, 15000)); // To simulate how to the queue will see a failure and retry

    for (const item of event.items) {
      this.logger.log(
        `-> Reserved ${item.quantity} x product ${item.productId}`,
      );
    }

    await Promise.resolve(null);

    this.logger.log(`Stock reservation complete for order ${event.orderId}`);
  }
}
