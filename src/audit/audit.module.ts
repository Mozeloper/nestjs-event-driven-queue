import { Module } from '@nestjs/common';
// import { AuditListener } from './audit.listener.js';
import { AuditProcessor } from './audit.processor.js';

@Module({
  // providers: [AuditListener],
  providers: [AuditProcessor],
  exports: [AuditProcessor]
})
export class AuditModule {}
