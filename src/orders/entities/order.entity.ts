import { OrderItemDto } from '../dto/create-order.dto.js';

export type OrderStatus = 'pending' | 'confirmed' | 'failed';

export class Order {
    id: string;
    userId: string;
    items: OrderItemDto[];
    total: number;
    status: OrderStatus;
    createdAt: Date
}
