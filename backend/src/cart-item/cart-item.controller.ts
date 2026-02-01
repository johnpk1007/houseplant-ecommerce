import { Body, Controller, Delete, Patch, Post } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { User } from '../common/decorator';
import { CartItemDto, DeleteCartItemDto, EditCartItemDto } from './dto';

@Controller('cart-item')
export class CartItemController {
    constructor(private cartItemService: CartItemService) { }

    @Post()
    async createCartItem(@User('id') userId: number, @Body() dto: CartItemDto) {
        return await this.cartItemService.createCartItem({ userId, productId: dto.productId, quantity: dto.quantity })
    }

    @Patch()
    async editCartItem(@User('id') userId: number, @Body() dto: EditCartItemDto) {
        return await this.cartItemService.editCartItem({ userId, cartItemId: dto.cartItemId, quantity: dto.quantity })
    }

    @Delete()
    async deleteCartItem(@User('id') userId: number, @Body() dto: DeleteCartItemDto) {
        return await this.cartItemService.deleteCartItem({ userId, cartItemId: dto.cartItemId })
    }

}
