import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { User } from '../common/decorator';
import { CartItemDto, DeleteCartItemDto, EditCartItemDto } from './dto';
import { JwtGuard } from '../common/guard';

@Controller('cart-item')
export class CartItemController {
    constructor(private cartItemService: CartItemService) { }

    @UseGuards(JwtGuard)
    @Post()
    async createCartItem(@User('userId') userId: number, @Body() dto: CartItemDto) {
        return await this.cartItemService.createCartItem({ userId, productId: dto.productId, quantity: dto.quantity })
    }

    @UseGuards(JwtGuard)
    @Get()
    async getAllCartItem(@User('userId') userId: number) {
        return await this.cartItemService.getAllCartItem({ userId })
    }

    @UseGuards(JwtGuard)
    @Patch()
    async editCartItem(@User('userId') userId: number, @Body() dto: EditCartItemDto) {
        return await this.cartItemService.editCartItem({ userId, cartItemId: dto.cartItemId, quantity: dto.quantity })
    }

    @UseGuards(JwtGuard)
    @Delete()
    async deleteCartItem(@User('userId') userId: number, @Body() dto: DeleteCartItemDto) {
        return await this.cartItemService.deleteCartItem({ userId, cartItemId: dto.cartItemId })
    }

}
