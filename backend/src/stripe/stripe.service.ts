import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
    private readonly stripe: Stripe
    constructor(private configService: ConfigService) {
        this.stripe = new Stripe(this.configService.getOrThrow<string>('STRIPE_SECRET'))
    }

    async creatProduct({ name, description, price, image }: { name: string, description: string, price: number, image: string }) {
        return await this.stripe.products.create({
            name, description, images: [image], default_price_data: { currency: 'usd', unit_amount: price * 100 }
        })
    }

    async getProduct({ id }: { id: string }) {
        return await this.stripe.products.retrieve(id)
    }

    async updateProduct({ id, dto }: { id: string, dto: { name?: string, description?: string, images?: string[], default_price?: string, active?: boolean } }) {
        return await this.stripe.products.update(id, dto)
    }

    async createPrice({ productId, price }: { productId: string, price: number }) {
        return await this.stripe.prices.create({
            currency: 'usd',
            unit_amount: price * 100,
            product: productId
        })
    }

    async updatePrice({ priceId, activeStatus }: { priceId: string, activeStatus: boolean }) {
        return await this.stripe.prices.update(priceId, {
            active: activeStatus
        })
    }
}
