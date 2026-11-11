import { Type } from 'class-transformer';
import {
  IsArray,
  IsString,
  IsPositive,
  IsNotEmpty,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';

export class OrderItemDto {
  @IsUUID()
  productId: string;

  @IsPositive()
  @IsNumber()
  quantity: number;

  @IsPositive()
  @IsNumber()
  unitPrice: number;
}

export class CreateOrderDto {
  @IsUUID()
  userId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty()
  items: OrderItemDto[];
}
