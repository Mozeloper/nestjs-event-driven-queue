import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ORDER_EVENTS } from '../orders/events/order-events.contants.js';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { safeListener } from '../common/utils/safe-listener.utils.js';

@Injectable()
export class NotificationListener {
  private readonly logger = new Logger(NotificationListener.name);

  @OnEvent(ORDER_EVENTS.CREATED)
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await safeListener(NotificationListener.name, ORDER_EVENTS.CREATED, () => {
      this.logger.log(
        `Sending Confirmation Email ${event.orderId} to user ${event.userId}`,
      );

      this.logger.log(
        `Confirmation Email Queued for order ${event.orderId} - total ${event.total.toFixed(2)}`,
      );
    });
  }
}
