import { IsNumber, IsOptional, IsString } from "class-validator"
import { Type } from "class-transformer"

export class NewProductDto {
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