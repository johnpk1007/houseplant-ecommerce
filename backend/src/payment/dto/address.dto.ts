import { IsString, IsNotEmpty } from "class-validator";

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
    extendedAddress: string;

    @IsString()
    @IsNotEmpty()
    streetNumber: string;

    @IsString()
    @IsNotEmpty()
    route: string;

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