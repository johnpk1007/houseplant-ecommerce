import { ArrayNotEmpty, IsArray, IsInt, IsNotEmpty } from "class-validator";

export class PaymentDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    cartItemIdArr: number[]
}