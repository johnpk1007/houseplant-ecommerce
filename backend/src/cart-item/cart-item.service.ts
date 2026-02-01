import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class CartItemService {
    constructor(
        private prismaService: PrismaService,
        private cartService: CartService,
    ) { }

    async createCartItem({ userId, productId, quantity }: { userId: number, productId: number, quantity: number }) {
        const cart = await this.cartService.getOrCreateCart({ userId })
        return await this.prismaService.cartItem.upsert({
            where: {
                productId_cartId: { productId, cartId: cart.id }
            },
            update: { quantity },
            create: { productId, cartId: cart.id, quantity }
        })
    }

    async editCartItem({ userId, cartItemId, quantity }: { userId: number, cartItemId: number, quantity: number }) {
        const cartItem = await this.prismaService.cartItem.updateManyAndReturn({
            where: {
                id: cartItemId,
                cart: {
                    userId
                }
            },
            data: {
                quantity
            }
        })
        if (cartItem.length == 0) {
            const notFoundCartItem = await this.prismaService.cartItem.findUnique({ where: { id: cartItemId } })
            if (notFoundCartItem) {
                throw new UnauthorizedException()
            } else {
                throw new NotFoundException()
            }
        }
        return cartItem[0]
    }

    async deleteCartItem({ userId, cartItemId }: { userId: number, cartItemId: number }) {
        const cartItem = await this.prismaService.cartItem.deleteMany({
            where: {
                id: cartItemId,
                cart: {
                    userId
                }
            },
        })
        if (cartItem.count == 0) {
            const notFoundCartItem = await this.prismaService.cartItem.findUnique({ where: { id: cartItemId } })
            if (notFoundCartItem) {
                throw new UnauthorizedException()
            } else {
                throw new NotFoundException()
            }
        }
        return cartItem
    }
}
