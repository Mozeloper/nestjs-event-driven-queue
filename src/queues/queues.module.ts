import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QUEUE_NAMES } from './queues.constants.js';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: QUEUE_NAMES.INVENTORY },
      { name: QUEUE_NAMES.NOTIFICATIONS },
      { name: QUEUE_NAMES.PAYMENTS },
      { name: QUEUE_NAMES.AUDITS },
    ),
    BullBoardModule.forFeature(
    {
      name: QUEUE_NAMES.INVENTORY,
      adapter: BullMQAdapter,
    },
    {
      name: QUEUE_NAMES.NOTIFICATIONS,
      adapter: BullMQAdapter,
    },
    {
      name: QUEUE_NAMES.PAYMENTS,
      adapter: BullMQAdapter,
    },
    {
      name: QUEUE_NAMES.AUDITS,
      adapter: BullMQAdapter,
    },
  ),
  ],
  exports: [BullModule],
})
export class QueuseModule {}
