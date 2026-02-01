import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CartItemService } from '../cart-item/cart-item.service';

@Injectable()
export class CartService {
    constructor(
        private prismaService: PrismaService,
        private cartItemService: CartItemService
    ) { }

    async getOrCreateCart({ userId }: { userId: number }) {
        return await this.prismaService.cart.upsert({
            where: { userId },
            update: {},
            create: {
                userId
            }
        })
    }
}
