import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';
// import { EventEmitter2 } from '@nestjs/event-emitter';
import { ORDER_EVENTS } from './events/order-events.contants.js';
import { OrderCreatedEvent } from './events/order-created.event.js';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../queues/queues.constants.js';
import { Queue } from 'bullmq';

const JOB_OPTIONS = {
  attempts: 3,
  backoff: {
    type: 'exponential' as const,
    delay: 2000,
  },
  removeOnComplete: 100,
  removeOnFail: false,
};

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);
  private readonly orders: Order[] = [];

  // For Event emitting
  // constructor(private readonly eventEmitter: EventEmitter2) {}

  // For Adding events to queue
  // constructor(
  //   @InjectQueue(QUEUE_NAMES.ORDER_EVENTS)
  //   private readonly orderEventsQueue: Queue,
  // ) {}

  constructor(
    @InjectQueue(QUEUE_NAMES.INVENTORY) private readonly inventoryQueue: Queue,
    @InjectQueue(QUEUE_NAMES.NOTIFICATIONS)
    private readonly notificationQueue: Queue,
    @InjectQueue(QUEUE_NAMES.PAYMENTS) private readonly paymentQueue: Queue,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const total = dto.items.reduce(
      (sum, item) => sum + item.quantity + item.unitPrice,
      0,
    );
    const order: Order = {
      id: randomUUID(),
      userId: dto.userId,
      items: dto.items,
      total,
      status: 'pending',
      createdAt: new Date(),
    };
    this.orders.push(order);
    this.logger.log(`Order ${order.id} created for user ${order.userId}`);

    // await this.orderEventsQueue.add(
    //   ORDER_EVENTS.CREATED,
    //   new OrderCreatedEvent(order.id, dto.userId, dto.items, order.total),
    //   {
    //     attempts: 3,
    //     backoff: {
    //       type: 'exponential',
    //       delay: 2000,
    //     },
    //     removeOnComplete: 100,
    //     removeOnFail: false,
    //   },
    // );

    // this.eventEmitter.emit(
    //   ORDER_EVENTS.CREATED,
    //   new OrderCreatedEvent(order.id, dto.userId, dto.items, order.total),
    // );

    const event = new OrderCreatedEvent(
      order.id,
      dto.userId,
      dto.items,
      order.total,
    );

    await Promise.all([
      this.inventoryQueue.add(ORDER_EVENTS.CREATED, event, JOB_OPTIONS),
      this.notificationQueue.add(ORDER_EVENTS.CREATED, event, JOB_OPTIONS),
      this.paymentQueue.add(ORDER_EVENTS.CREATED, event, JOB_OPTIONS),
    ]);

    return order;
  }

  findOne(id: string): Order | undefined {
    return this.orders.find((order) => order.id === id);
  }

  findAll(): Order[] {
    return this.orders;
  }
}
