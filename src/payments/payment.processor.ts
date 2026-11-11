import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { OrderCreatedEvent } from '../orders/events/order-created.event.js';
import { ORDER_EVENTS } from '../orders/events/order-events.contants.js';
import { QUEUE_NAMES } from '../queues/queues.constants.js';
import { PaymentGatewayService } from './payment-gateway.service.js';
import { IdempotencyService } from './idempotency.service.js';

const PAYMENT_IDEMPOTENCY_TTL_SECONDS = 60 * 60 * 24; // 24hrs

@Processor(QUEUE_NAMES.PAYMENTS)
export class PaymentProcessor extends WorkerHost {
  private readonly logger = new Logger(PaymentProcessor.name);

  constructor(
    private readonly paymentGatewayService: PaymentGatewayService,
    private readonly idempotencyService: IdempotencyService,
  ) {
    super();
  }

  async process(job: Job<OrderCreatedEvent, void, string>): Promise<void> {
    if (job.name !== ORDER_EVENTS.CREATED) return;

    const event = job.data;

    const idempontencyKey = `payment:${event.orderId}`;

    const isNewReservation = await this.idempotencyService.reserve(
      idempontencyKey,
      PAYMENT_IDEMPOTENCY_TTL_SECONDS,
    );

    if (!isNewReservation) {
      this.logger.warn(
        `Order ${event.orderId} already has a reserved/completed payment -- skipping duplicate charge [attempts ${job.attemptsMade + 1}]`,
      );

      return;
    }

    this.logger.log(
      `Idempotency key reserved for order ${event.orderId} - proceeding to charge`,
    );

    this.logger.log(
      `Processing payment for order: ${event.orderId} [attempts ${job.attemptsMade + 1}]`,
    );

    try {
      await this.paymentGatewayService.charge(event.orderId, event.total);
    } catch {
      await this.idempotencyService.release(idempontencyKey);
    }

    // For testing mode

    if (job.attemptsMade === 0) {
      throw new Error(
        'Failed to persist payment confirmation after successful charge',
      );
    }

    this.logger.log(`Payment Confirmed for order: ${event.orderId}`);

    await Promise.resolve(null);
  }
}
