import { Body, Controller, Headers, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import { JwtGuard } from '../common/guard';
import { User } from '../common/decorator';
import { PaymentDto } from './dto';
import { PaymentService } from './payment.service';
import { Role } from '../common/enum';
import { StripeService } from '../stripe/stripe.service';

@Controller('payment')
export class PaymentController {
    constructor(
        private paymentService: PaymentService,
        private stripeService: StripeService
    ) { }


    @UseGuards(JwtGuard)
    @Post()
    @HttpCode(HttpStatus.OK)
    async createPayment(@User() user: {
        userId: number;
    }, @Body() dto: PaymentDto) {
        return await this.paymentService.createPayment({ userId: user.userId, addressState: dto.addressState, cartItemIdArray: dto.cartItemIdArray })
    }

    @Post('/webhook')
    @HttpCode(HttpStatus.OK)
    async fullfillOrder(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') signature: string) {
        console.log('Webhook received at:', Date.now());
        const event = this.stripeService.constructEvent({ payload: req.rawBody, signature })
        if (
            event.type === 'payment_intent.succeeded'
        ) {
            return await this.paymentService.fullfillCheckout({ paymentIntentId: event.data.object.id });
        }
    }
}
