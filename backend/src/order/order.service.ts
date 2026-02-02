import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './enum';

@Injectable()
export class OrderService {
    constructor(private prismaService: PrismaService) { }

    async createOrder({ userId, cartItemIdArr }: { userId: number, cartItemIdArr: number[] }) {
        return this.prismaService.$transaction(async (tx) => {
            if (cartItemIdArr.length === 0) {
                throw new BadRequestException()
            }
            const cartItems = await tx.cartItem.findMany({
                where: {
                    id: { in: cartItemIdArr },
                    cart: { userId: userId }
                },
                include: { product: true }
            })
            if (cartItems.length === 0) {
                throw new NotFoundException()
            }
            return await tx.order.create({
                data: {
                    userId,
                    orderItems: {
                        create: cartItems.map((cart) => ({
                            productId: cart.productId,
                            quantity: cart.quantity,
                            price: cart.product.price
                        }))
                    }
                },
                include: { orderItems: { include: { product: true } } }
            })
        })
    }

    async editOrderStatus({ userId, orderId, orderStatus }: { userId: number, orderId: number, orderStatus: OrderStatus }) {
        const order = await this.prismaService.order.updateManyAndReturn({
            where: {
                id: orderId,
                userId
            },
            data: {
                orderStatus
            },
        })
        if (order.length === 0) {
            const notFoundOrder = await this.prismaService.order.findUnique({ where: { id: orderId } })
            if (notFoundOrder) {
                throw new UnauthorizedException()
            } else {
                throw new NotFoundException()
            }
        }
        return order[0]
    }

    async getOrder({ userId, orderId }: { userId: number, orderId: number }) {
        const order = await this.prismaService.order.findMany({
            where: {
                id: orderId,
                userId
            },
            include: { orderItems: { include: { product: true } } }
        })
        if (order.length === 0) {
            const notFoundOrder = await this.prismaService.order.findUnique({ where: { id: orderId } })
            if (notFoundOrder) {
                throw new UnauthorizedException()
            } else {
                throw new NotFoundException()
            }
        }
        return order[0]
    }

    async getAllOrder({ userId }: { userId: number }) {
        return await this.prismaService.order.findMany({ where: { userId }, include: { orderItems: { include: { product: true } } } })
    }
}
