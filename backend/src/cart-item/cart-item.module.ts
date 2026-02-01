import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';

@Module({
  providers: [CartItemService],
  exports: [CartItemService],
  controllers: [CartItemController]
})
export class CartItemModule { }
