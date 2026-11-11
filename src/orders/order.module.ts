import { Module } from '@nestjs/common';
import { OrderControler } from './order.controller.js';
import { OrderService } from './order.service.js';
import { QueuseModule } from '../queues/queues.module.js';

@Module({
  imports: [QueuseModule],
  controllers: [OrderControler],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
