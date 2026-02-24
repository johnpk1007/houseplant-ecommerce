import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { ProductService } from '../product/product.service';
import { ConfigService } from '@nestjs/config';
import { Product, CartItem } from '../../generated/prisma/client';

type ProductWithUrl = Omit<Product, 'keyName'> & {
    url: string
}

type CartItemWithProduct = Omit<CartItem, 'product'> & {
    product: ProductWithUrl
}

@Injectable()
export class CartItemService {

    private readonly endpoint: string;
    private readonly bucket: string;
    constructor(
        private prismaService: PrismaService,
        private productService: ProductService,
        private configService: ConfigService,
    ) {
        this.endpoint = this.configService.getOrThrow<string>('S3_PUBLIC_ENDPOINT'),
            this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME')
    }

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
            const foundCartItem = await tx.cartItem.findUnique({
                where: { productId_cartId: { productId, cartId: cart.id } }
            })
            let cartItemQuantity = 0
            if (foundCartItem) {
                cartItemQuantity = foundCartItem.quantity
            }
            cartItemQuantity += quantity
            if (product.stock < cartItemQuantity) {
                throw new BadRequestException({ message: 'NOT ENOUGH STOCK' })
            }
            const cartItem = await tx.cartItem.upsert({
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
            const { keyName, ...rest } = cartItem.product
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            return {
                ...cartItem,
                product: {
                    ...rest,
                    url
                }
            }
        })
    }

    async getAllCartItem({ userId }: { userId: number }): Promise<CartItemWithProduct[]> {
        const cartItems = await this.prismaService.cartItem.findMany({ where: { cart: { userId } }, include: { product: true } })
        return cartItems.map((cartItem) => {
            const { keyName, ...rest } = cartItem.product
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            return {
                ...cartItem,
                product: {
                    ...rest,
                    url
                }
            }
        })
    }

    async editCartItem({ userId, cartItemId, quantity }: { userId: number, cartItemId: number, quantity: number }) {
        try {
            const cartItem = await this.prismaService.cartItem.update({
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
            const { keyName, ...rest } = cartItem.product
            const url = `${this.endpoint}/${this.bucket}/${keyName}`
            return {
                ...cartItem,
                product: {
                    ...rest,
                    url
                }
            }
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
