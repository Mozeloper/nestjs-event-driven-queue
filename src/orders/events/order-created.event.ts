import { OrderItemDto } from '../dto/create-order.dto.js';

export class OrderCreatedEvent {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: OrderItemDto[],
    public readonly total: number,
    public readonly occuredAt: Date = new Date(),
  ) {}
}
