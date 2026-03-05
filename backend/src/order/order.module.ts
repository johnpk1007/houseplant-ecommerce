import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [OrderService, ConfigModule],
  exports: [OrderService],
  controllers: [OrderController]
})
export class OrderModule { }
