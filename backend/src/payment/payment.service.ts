import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, } from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { StripeService } from '../stripe/stripe.service';
import { OrderStatus } from '../order/enum';
import { ProductService } from '../product/product.service';
import { AddressState, OrderForPayment } from './type';
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
    async createPayment({ userId, addressState, cartItemIdArray }: { userId: number, addressState: AddressState, cartItemIdArray: number[] }) {
        const order = await this.orderService.createOrder({ userId, addressState, cartItemIdArray })
        try {
            const totalOrderAmount = order.orderItems.reduce((sum: number, item: { quantity: number, price: number }) => sum + item.quantity * item.price, 0)
            const paymentIntent = await this.stripeService.createPayment({
                totalOrderAmount: totalOrderAmount * 100, metadata: { orderId: order.id.toString() }
            })
            return { clientSecret: paymentIntent.clientSecret }
        } catch (error) {
            await this.orderService.editOrder({ orderId: order.id, dto: { orderStatus: OrderStatus.Failed } }).catch(err => console.error('Prisma Rollback Failed:', err))
            throw new InternalServerErrorException({ message: 'CREATE ORDER FAILED' })
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
                                throw new NotFoundException({ message: 'PRODUCT NOT FOUND' });
                            }
                            if (foundProduct.stock < order.quantity) {
                                throw new BadRequestException({ message: 'NOT ENOUGH STOCK' })
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
                return
            } else {
                throw new InternalServerErrorException()
            }
        }
    }
}