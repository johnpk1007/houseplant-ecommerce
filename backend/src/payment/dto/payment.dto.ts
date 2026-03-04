import { ArrayNotEmpty, IsArray, IsInt, IsString, IsNotEmpty } from "class-validator";
import { AddressStateDto } from "./address.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class PaymentDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsInt({ each: true })
    cartItemIdArray: number[]

    @ValidateNested()
    @Type(() => AddressStateDto)
    addressState: AddressStateDto
}