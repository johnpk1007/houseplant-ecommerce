import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { CartItemController } from './cart-item.controller';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ProductModule],
  providers: [CartItemService],
  exports: [CartItemService],
  controllers: [CartItemController]
})
export class CartItemModule { }
