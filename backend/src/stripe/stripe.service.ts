import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe
    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET'))
    }

    async createPayment({ totalOrderAmount }: { totalOrderAmount: number }) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: totalOrderAmount,
                currency: "usd",
                payment_method_types: ['card'],
            });
            return { clientSecret: paymentIntent.client_secret }
        } catch (error) {
            throw new InternalServerErrorException()
        }

    }

    constructEvent({ payload, signature }) {
        try {
            return this.stripe.webhooks.constructEvent(payload, signature, this.configService.getOrThrow('STRIPE_ENDPOINT'))
        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    async refund({ payment_intent }) {
        try {
            return await this.stripe.refunds.create({ payment_intent })
        } catch (error) {
            throw new InternalServerErrorException()
        }

    }
}
