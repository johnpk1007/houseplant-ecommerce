import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtGuard } from '../common/guard';
import { User } from '../common/decorator';
import { OrderDto } from './dto';

@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) { }

    @UseGuards(JwtGuard)
    @Post()
    async getOrder(@User('userId') userId: number, @Body() dto: OrderDto) {
        return await this.orderService.getOrderWithUserId({ userId, paymentIntentId: dto.paymentIntentId })
    }

    @UseGuards(JwtGuard)
    @Get()
    async getAllOrder(@User('userId') userId: number) {
        return await this.orderService.getAllOrder({ userId })
    }
}
