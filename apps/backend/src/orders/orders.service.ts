import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  createOrder(payload: CreateOrderDto) {
    console.log('Received order payload:', payload);

    return {
      orderId: randomUUID(),
      status: 'success' as const,
    };
  }
}
