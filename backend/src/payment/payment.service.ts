import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { StripeService } from '../stripe/stripe.service';
import { OrderStatus } from '../order/enum';
import { ProductService } from '../product/product.service';
import { OrderForPayment } from './type';
import { CartItemService } from '../cart-item/cart-item.service';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
    constructor(
        private orderService: OrderService,
        private stripeService: StripeService,
        private productService: ProductService,
        private cartItemService: CartItemService,
        private prismaService: PrismaService
    ) { }
    async createPayment({ userId, email, cartItemIdArr }: { userId: number, email: string, cartItemIdArr: number[] }) {
        type orderType = Awaited<ReturnType<typeof this.orderService.createOrder>>
        let order: orderType | null = null
        let editedOrder: orderType | null = null
        try {
            order = await this.orderService.createOrder({ userId, cartItemIdArr })
            const line_items_array = order.orderItems.map((orderItem) => {
                const stripePriceId = orderItem.product.stripePriceId
                const quantity = orderItem.quantity
                return { price: stripePriceId, quantity }
            })
            const stripeResponse = await this.stripeService.createSession({ customer_email: email, line_items_array })
            editedOrder = await this.orderService.editOrder({ orderId: order.id, dto: { stripeSessionId: stripeResponse.id } })
            return stripeResponse
        } catch (error) {
            console.error(error)
        }
    }

    async fullfillCheckout({ sessionId }) {
        let refund: Stripe.Response<Stripe.Refund> | null = null

        const order = await this.orderService.sessionIdgetOrder({ sessionId })
        if (order) {
            if (order.orderStatus === 'PAID') {
                return
            }

            const checkoutSession = await this.stripeService.checkoutSession({ sessionId })
            if (checkoutSession.payment_status === 'paid') {
                try {
                    await this.prismaService.$transaction(async (tx) => {
                        await this.orderService.editOrder({ orderId: order.id, dto: { orderStatus: OrderStatus.Paid }, tx })
                        const orderArray: OrderForPayment[] = order.orderItems.map(orderItem => {
                            const productId = orderItem.productId
                            const quantity = orderItem.quantity
                            return { productId, quantity }
                        })
                        const productIdArray = orderArray.map((order) => {
                            return order.productId
                        })
                        const productArray = await this.productService.getManyProducts({ productIdArray, tx })
                        for (const order of orderArray) {
                            const foundProduct = productArray.find((product) =>
                                product.id === order.productId
                            )
                            if (!foundProduct) {
                                throw new NotFoundException();
                            }
                            if (foundProduct.stock < order.quantity) {
                                throw new BadRequestException()
                            }
                            order.productVersion = foundProduct.version
                        }
                        await this.productService.decreaseManyProductStock({ orderArray, tx })
                    })
                } catch (error) {
                    if (error instanceof BadRequestException) {
                        try {
                            refund = await this.stripeService.refund({ payment_intent: checkoutSession.payment_intent })
                            await this.orderService.editOrder({ orderId: order.id, dto: { orderStatus: OrderStatus.Failed } })
                        } catch (error) {
                            console.error(error)
                        }
                    }
                }
                if (!refund) {
                    try {
                        await this.cartItemService.deleteManyCartItem({ cartItemIdArray: order.cartItems })
                    } catch (error) {
                        console.error(error)
                    }
                }
                console.log('done!')
                return
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}