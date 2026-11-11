import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { ORDER_EVENTS } from '../orders/events/order-events.contants.js';
import { QUEUE_NAMES } from '../queues/queues.constants.js';
import { AuditLogEntry } from './audit-log.entry.js';

// @Processor(QUEUE_NAMES.ORDER_EVENTS) // For Emitting event sample
@Processor(QUEUE_NAMES.AUDITS)
export class AuditProcessor extends WorkerHost {
  private readonly logger = new Logger(AuditProcessor.name);

  private readonly entries: AuditLogEntry[] = [];

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) return;
    const event = job.data;

    const entry: AuditLogEntry = {
      orderId: event.orderId,
      eventNameSpace: 'order.*',
      capturedAt: new Date(),
      summary: `Order ${event.orderId} - total ${event.total.toFixed(2)} - ${event.items.length} item(s)`,
    };

    this.entries.push(entry);

    this.logger.log(`Audit Entry recorded: ${entry.summary}`);

    await Promise.resolve(null);
  }

  findAll(): AuditLogEntry[] {
    return this.entries;
  }
}
