import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './enum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Prisma } from '../../generated/prisma/client';
import { AddressState } from '../payment/type';

@Injectable()
export class OrderService {
    constructor(private prismaService: PrismaService) { }

    async createOrder({ userId, addressState, cartItemIdArray, paymentIntentId }: { userId: number, addressState: AddressState, cartItemIdArray: number[], paymentIntentId: string }) {
        return this.prismaService.$transaction(async (tx) => {
            if (cartItemIdArray.length === 0) {
                throw new BadRequestException({ message: 'NO CART ITEMS IN REQUEST' })
            }
            const cartItems = await tx.cartItem.findMany({
                where: {
                    id: { in: cartItemIdArray },
                    cart: { userId: userId }
                },
                include: { product: true }
            })
            if (cartItems.length === 0) {
                throw new NotFoundException({ message: 'CART ITEMS NOT FOUND' })
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
                    },
                    cartItems: cartItemIdArray,
                    paymentIntentId,
                    firstName: addressState.firstName,
                    lastName: addressState.lastName,
                    phoneNumber: addressState.phoneNumber,
                    extendedAddress: addressState.extendedAddress,
                    streetNumber: addressState.streetNumber,
                    route: addressState.route,
                    locality: addressState.locality,
                    administrativeAreaLevel1: addressState.administrativeAreaLevel1,
                    postalCode: addressState.postalCode
                },
                include: { orderItems: { include: { product: true } } }
            })
        })
    }

    async editOrder({ orderId, dto, tx }: { orderId: number, dto: { orderStatus: OrderStatus }, tx?: Prisma.TransactionClient }) {
        const prismaService = tx ?? this.prismaService
        try {
            return await prismaService.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    ...dto
                },
                include: { orderItems: { include: { product: true } } }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({ message: 'ORDER NOT FOUND' })
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async getOrder({ userId, orderId }: { userId: number, orderId: number }) {
        try {
            return await this.prismaService.order.findUnique({
                where: {
                    id: orderId,
                    userId
                },
                include: { orderItems: { include: { product: true } } }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({ message: 'ORDER NOT FOUND' })
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async orderIdgetOrder({ paymentIntentId }: { paymentIntentId: string }) {
        return await this.prismaService.order.findFirstOrThrow({
            where: {
                paymentIntentId
            },
            include: { orderItems: { include: { product: true } } }
        })
    }

    async getAllOrder({ userId }: { userId: number }) {
        return await this.prismaService.order.findMany({ where: { userId }, include: { orderItems: { include: { product: true } } } })
    }
}
