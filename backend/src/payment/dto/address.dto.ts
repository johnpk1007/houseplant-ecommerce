import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class AddressStateDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    phoneNumber: string;

    @IsString()
    @IsNotEmpty()
    streetAddress: string;

    @IsString()
    @IsOptional()
    extendedAddress: string;

    @IsString()
    @IsNotEmpty()
    locality: string;

    @IsString()
    @IsNotEmpty()
    administrativeAreaLevel1: string;

    @IsString()
    @IsNotEmpty()
    postalCode: string;
}