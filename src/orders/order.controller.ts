import {
  Controller,
  Body,
  Post,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { OrderService } from './order.service.js';

@Controller('orders')
export class OrderControler {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Get()
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const order = this.orderService.findOne(id);
    if (!order) {
      throw new NotFoundException(`Order ${id} Not found`);
    }
    return order;
  }
}
