import { IsNotEmpty, IsNumber, } from "class-validator"

export class CartItemDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number

    @IsNumber()
    @IsNotEmpty()
    quantity: number
}

export class EditCartItemDto {
    @IsNumber()
    @IsNotEmpty()
    cartItemId: number


    @IsNumber()
    @IsNotEmpty()
    quantity: number
}

export class DeleteCartItemDto {
    @IsNumber()
    @IsNotEmpty()
    cartItemId: number
}

