import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async createUser({ email, password }: { email: string, password: string }) {
        const hash = await bcrypt.hash(password, 10);
        return await this.prismaService.user.create({
            data: {
                email,
                hash,
            }
        })
    }
    async findUser({ email }: { email: string }) {
        try {
            return await this.prismaService.user.findUniqueOrThrow({
                where: { email }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException()
                }
            }
            throw new InternalServerErrorException()
        }

    }
    async updateUser({ email, dto }: { email: string, dto: { hashedRefreshToken: string | null } }) {
        try {
            return await this.prismaService.user.update({
                where: { email },
                data: { ...dto }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException()
                }
            }
            throw new InternalServerErrorException()
        }

    }
}
