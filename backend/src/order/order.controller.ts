import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { User } from '../common/decorator';
import { EditOrderDto, CreateOrderDto } from './dto';
import { JwtGuard } from '../common/guard';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @UseGuards(JwtGuard)
    @Post()
    async createOrder(@User('userId') userId: number, @Body() dto: CreateOrderDto) {
        return this.orderService.createOrder({ userId, cartItemIdArr: dto.cartItemIdArr })
    }

    @UseGuards(JwtGuard)
    @Patch()
    async editOrderStatus(@User('userId') userId: number, @Body() dto: EditOrderDto) {
        return this.orderService.editOrderStatus({ userId, orderId: dto.orderId, orderStatus: dto.orderStatus })
    }

    @UseGuards(JwtGuard)
    @Get(':id')
    async getOrder(@User('userId') userId: number, @Param('id', ParseIntPipe) orderId: number) {
        return this.orderService.getOrder({ userId, orderId })
    }

    @UseGuards(JwtGuard)
    @Get()
    async getAllOrder(@User('userId') userId: number) {
        return this.orderService.getAllOrder({ userId })
    }
}
