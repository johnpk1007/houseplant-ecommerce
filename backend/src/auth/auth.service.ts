import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }
    async signup(dto: AuthDto) {
        const hash = await bcrypt.hash(dto.password, 10);
        try {
            const customer = await this.prisma.customer.create({
                data: {
                    email: dto.email,
                    hash,
                }
            })
            return customer
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken')
                }
            }
            throw error
        }


    }
    async signin(dto: AuthDto) {
        const customer = await this.prisma.customer.findUnique({
            where: { email: dto.email }
        })
        if (!customer) {
            throw new ForbiddenException(
                'Credentials incorrect'
            )
        }
        const pwMatches = await bcrypt.compare(dto.password, customer.hash)
        if (!pwMatches) {
            throw new ForbiddenException(
                'Credentials incorrect'
            )
        }
        return customer
    }
}