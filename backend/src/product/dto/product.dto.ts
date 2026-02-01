import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"
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

export class EditProductDto {
    @IsString()
    @IsOptional()
    name?: string

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    price?: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    light?: string

    @IsString()
    @IsOptional()
    water?: string

    @IsString()
    @IsOptional()
    temperature?: string

    @Type(() => Number)
    @IsNumber()
    @IsOptional()
    stock?: number
}