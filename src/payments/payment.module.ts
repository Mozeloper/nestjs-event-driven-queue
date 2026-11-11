import { Module } from '@nestjs/common';
import { PaymentProcessor } from './payment.processor.js';
import { PaymentGatewayService } from './payment-gateway.service.js';
import { IdempotencyService } from './idempotency.service.js';

@Module({
    providers: [PaymentGatewayService, PaymentProcessor, IdempotencyService],
    exports: [PaymentGatewayService]
})

export class PaymentModule {}