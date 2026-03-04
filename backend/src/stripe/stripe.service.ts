import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe
    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET'))
    }

    async createPayment({ totalOrderAmount, metadata }: { totalOrderAmount: number, metadata: { orderId: string } }) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: totalOrderAmount,
            currency: "usd",
            payment_method_types: ['card'],
            metadata
        });

        return { clientSecret: paymentIntent.client_secret }
    }

    constructEvent({ payload, signature }) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, this.configService.getOrThrow('STRIPE_ENDPOINT'))
        } catch (err) {
            throw new InternalServerErrorException()
        }
    }

    async refund({ payment_intent }) {
        return await this.stripe.refunds.create({ payment_intent })
    }
}
