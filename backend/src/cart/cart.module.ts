import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { UserModule } from '../user/user.module';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  imports: [UserModule, CartItemModule],
  providers: [CartService]
})
export class CartModule { }
