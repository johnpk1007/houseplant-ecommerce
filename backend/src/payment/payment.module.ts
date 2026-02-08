import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { OrderModule } from '../order/order.module';
import { StripeModule } from '../stripe/stripe.module';
import { ProductModule } from '../product/product.module';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  imports: [OrderModule, StripeModule, ProductModule, CartItemModule],
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule { }
