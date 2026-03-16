import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus } from './enum';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { Prisma } from '../../generated/prisma/client';
import { AddressState } from '../payment/type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OrderService {
    private readonly endpoint: string;
    private readonly bucket: string;
    constructor(
        private prismaService: PrismaService,
        private configService: ConfigService,
    ) {
        this.endpoint = this.configService.getOrThrow<string>('S3_PUBLIC_ENDPOINT'),
            this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    }

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
                    streetAddress: addressState.streetAddress,
                    extendedAddress: addressState.extendedAddress || "",
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

    async getOrderWithUserId({ userId, paymentIntentId }: { userId: number, paymentIntentId: string }) {
        return await this.prismaService.order.findFirstOrThrow({
            where: {
                paymentIntentId,
                userId
            },
            include: { orderItems: { include: { product: true } } }
        })
    }

    async getOrder({ paymentIntentId }: { paymentIntentId: string }) {
        return await this.prismaService.order.findFirstOrThrow({
            where: {
                paymentIntentId
            },
            include: { orderItems: { include: { product: true } } }
        })
    }

    async getAllOrder({ userId }: { userId: number }) {
        const orders = await this.prismaService.order.findMany({ where: { userId }, include: { orderItems: { include: { product: true } } } })
        return orders.map((order) => {
            const { orderItems, ...rest } = order
            const editedOrderItems = orderItems.map((orderItem) => {
                const { keyName, ...rest } = orderItem.product
                const url = `${this.endpoint}/${keyName}`
                return {
                    ...orderItem,
                    product: {
                        ...rest,
                        url
                    }
                }
            })
            return {
                orderItems: editedOrderItems, ...rest
            }
        })
    }
}
