import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ORDER_EVENTS } from '../orders/events/order-events.contants.js';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { safeListener } from '../common/utils/safe-listener.utils.js';

@Injectable()
export class InventoryListener {
  private readonly logger = new Logger(InventoryListener.name);

  @OnEvent(ORDER_EVENTS.CREATED)
  async handleOrderCreated(event: OrderCreatedEvent): Promise<void> {
    await safeListener(InventoryListener.name, ORDER_EVENTS.CREATED, () => {
      this.logger.log(
        `Reserving Stock for Order ${event.orderId} (${event.items.length}) item(s)`,
      );

      for (const item of event.items) {
        this.logger.log(
          `-> Reserved ${item.quantity} x product ${item.productId}`,
        );
      }

      this.logger.log(`Stock reservation complete for order ${event.orderId}`);
    });
  }
}
