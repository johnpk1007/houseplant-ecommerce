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
            const product = await this.productService.getProduct({ id: productId, tx })
            const cart = await tx.cart.upsert({
                where: { userId },
                update: {},
                create: {
                    userId
                }
            })
            const cartItem = await tx.cartItem.findUnique({
                where: { productId_cartId: { productId, cartId: cart.id } }
            })
            let cartItemQuantity = 0
            if (cartItem) {
                cartItemQuantity = cartItem.quantity
            }
            cartItemQuantity += quantity
            if (product.stock < cartItemQuantity) {
                throw new BadRequestException({ message: 'NOT ENOUGH STOCK' })
            }
            return await tx.cartItem.upsert({
                where: {
                    productId_cartId: { productId, cartId: cart.id }
                },
                update: {
                    quantity: {
                        increment: quantity
                    }
                },
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
                    throw new NotFoundException({ message: 'CART ITEM NOT FOUND' })
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
                    throw new NotFoundException({ message: 'CART ITEM NOT FOUND' })
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
                    throw new NotFoundException({ message: 'CART ITEM NOT FOUND' })
                }
            }
            throw new InternalServerErrorException()
        }
    }
}
