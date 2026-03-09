import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"

export class GooglelAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string
}