import { IsArray, IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { OrderStatus } from "../enum";

export class CreateOrderDto {
    @IsArray()
    @IsNotEmpty()
    cartItemIdArr: number[]
}

export class EditOrderDto {
    @IsNumber()
    @IsNotEmpty()
    orderId: number

    @IsNotEmpty()
    @IsEnum(OrderStatus)
    orderStatus: OrderStatus
}