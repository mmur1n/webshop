import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ICheckoutOrderPayload,
  IOrderCustomer,
  IOrderItem,
  IOrderShippingAddress,
  IOrderSummary,
} from '@webshop/shared';

class OrderCustomerDto implements IOrderCustomer {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;
}

class OrderShippingAddressDto implements IOrderShippingAddress {
  @IsString()
  address: string;

  @IsString()
  postalCode: string;

  @IsString()
  city: string;
}

class OrderItemDto implements IOrderItem {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  quantity: number;
}

class OrderSummaryDto implements IOrderSummary {
  @IsNumber()
  @Min(0)
  totalItems: number;

  @IsNumber()
  @Min(0)
  subtotal: number;

  @IsNumber()
  @Min(0)
  shipping: number;

  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateOrderDto implements ICheckoutOrderPayload {
  @ValidateNested()
  @Type(() => OrderCustomerDto)
  customer: OrderCustomerDto;

  @ValidateNested()
  @Type(() => OrderShippingAddressDto)
  shippingAddress: OrderShippingAddressDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => OrderSummaryDto)
  summary: OrderSummaryDto;
}
