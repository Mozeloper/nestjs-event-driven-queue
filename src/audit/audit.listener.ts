import { AuditLogEntry } from './audit-log.entry.js';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { safeListener } from '../common/utils/safe-listener.utils.js';

export class AuditListener {
  private readonly logger = new Logger(AuditListener.name);

  private readonly entries: AuditLogEntry[] = [];
  @OnEvent('order.*')
  async handleOrderNameSpaceEvent(payload: OrderCreatedEvent): Promise<void> {
    await safeListener(AuditListener.name, 'order.*', () => {
      const entry: AuditLogEntry = {
        orderId: payload.orderId,
        eventNameSpace: 'order.*',
        capturedAt: new Date(),
        summary: `Order ${payload.orderId} - total ${payload.total.toFixed(2)} - ${payload.items.length} item(s)`,
      };

      this.entries.push(entry);

      this.logger.log(`Audit Entry recorded: ${entry.summary}`);
    });
  }

  findAll(): AuditLogEntry[] {
    return this.entries;
  }
}
