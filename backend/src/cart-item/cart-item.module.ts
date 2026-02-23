import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { ProductModule } from '../product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProductModule, ConfigModule],
  providers: [CartItemService],
  exports: [CartItemService],
  controllers: [CartItemController]
})
export class CartItemModule { }
