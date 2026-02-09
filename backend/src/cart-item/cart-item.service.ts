import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartItemService {
    constructor(
        private prismaService: PrismaService,
        private productService: ProductService
    ) { }

    async createCartItem({ userId, productId, quantity }: { userId: number, productId: number, quantity: number }) {
        return await this.prismaService.$transaction(async (tx) => {
            const cart = await tx.cart.upsert({
                where: { userId },
                update: {},
                create: {
                    userId
                }
            })
            const product = await this.productService.getProduct({ id: productId, tx })
            if (product.stock < quantity) {
                throw new BadRequestException()
            }
            return await tx.cartItem.upsert({
                where: {
                    productId_cartId: { productId, cartId: cart.id }
                },
                update: { quantity },
                create: { productId, cartId: cart.id, quantity },
                include: { product: true }
            })
        })
    }

    async getAllCartItem({ userId }: { userId: number }) {
        return await this.prismaService.cartItem.findMany({ where: { cart: { userId } }, include: { product: true } })
    }

    async editCartItem({ userId, cartItemId, quantity }: { userId: number, cartItemId: number, quantity: number }) {
        try {
            return await this.prismaService.cartItem.update({
                where: {
                    id: cartItemId,
                    cart: {
                        userId
                    }
                },
                data: {
                    quantity
                },
                include: { product: true }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException()
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async deleteCartItem({ userId, cartItemId }: { userId: number, cartItemId: number }) {
        try {
            return await this.prismaService.cartItem.delete({
                where: {
                    id: cartItemId,
                    cart: {
                        userId
                    }
                },
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException()
                }
            }
            throw new InternalServerErrorException()
        }
    }

    async deleteManyCartItem({ cartItemIdArray }: { cartItemIdArray: number[] }) {
        try {
            return await this.prismaService.cartItem.deleteMany({
                where: {
                    id: { in: cartItemIdArray },
                },
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException()
                }
            }
            throw new InternalServerErrorException()
        }
    }
}
