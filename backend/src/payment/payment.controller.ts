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
    async createPayment(@User() user: {
        userId: number;
        email: string;
        role: Role;
    }, @Body() dto: PaymentDto) {
        return await this.paymentService.createPayment({ userId: user.userId, email: user.email, cartItemIdArr: dto.cartItemIdArr })
    }

    @Post('/webhook')
    @HttpCode(HttpStatus.OK)
    async fullfillOrder(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
        const event = this.stripeService.constructEvent({ payload: req.rawBody, sig })
        if (
            event.type === 'checkout.session.completed'
            || event.type === 'checkout.session.async_payment_succeeded'
        ) {
            return await this.paymentService.fullfillCheckout({ sessionId: event.data.object.id });
        }
    }
}
