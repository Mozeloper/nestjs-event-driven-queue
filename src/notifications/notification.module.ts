import { Module } from '@nestjs/common';
// import { NotificationListener } from './notification.listener.js';
import { NotificationProcessor } from './notifications.processor.js';

@Module({
  // providers: [NotificationListener],
  providers: [NotificationProcessor],
})

export class NotificationModule {}
