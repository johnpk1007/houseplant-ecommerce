import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
import * as bcrypt from "bcrypt"

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    async createUser(email: string, password: string) {
        const hash = await bcrypt.hash(password, 10);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email,
                    hash,
                }
            })
            return user
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credential taken')
                }
            }
            throw error
        }
    }
    async findUser(email: string) {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })
        if (!user) {
            throw new ForbiddenException(
                'Credentials incorrect'
            )
        }
        return user
    }
}
