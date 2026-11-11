import { Module } from '@nestjs/common';
// import { InventoryListener } from './inventory.listener.js';
import { InventorProcessor } from './inventory.processor.js';

@Module({
  // providers: [InventoryListener],
  providers: [InventorProcessor],
})

export class InventoryModule {}
