import { IsNotEmpty, IsNumber, IsString } from "class-validator"
import { Type } from "class-transformer"

export class ProductDto {
    @IsString()
    @IsNotEmpty()
    name: string

    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    price: number

    @IsString()
    @IsNotEmpty()
    description: string

    @IsString()
    @IsNotEmpty()
    light: string

    @IsString()
    @IsNotEmpty()
    water: string

    @IsString()
    @IsNotEmpty()
    temperature: string

}