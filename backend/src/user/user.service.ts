import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt"
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) { }

    async localCreateUser({ email, password, hashedRefreshToken }: { email: string, password: string, hashedRefreshToken: string }) {
        const hash = await bcrypt.hash(password, 10);
        return await this.prismaService.user.create({
            data: {
                email,
                hash,
                hashedRefreshToken,
                provider: 'LOCAL'
            }
        })
    }
    async googleCreateUser({ email, hashedRefreshToken }: { email: string, hashedRefreshToken: string }) {
        return await this.prismaService.user.create({
            data: {
                email,
                hashedRefreshToken,
                provider: 'GOOGLE'
            }
        })
    }
    async findUser({ email }: { email: string }) {
        return await this.prismaService.user.findUnique({
            where: { email }
        })
    }
    async findUserOrThrow({ email }: { email: string }) {
        try {
            return await this.prismaService.user.findUniqueOrThrow({
                where: { email }
            })
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('USER NOT FOUND')
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
                    throw new NotFoundException({ message: 'USER NOT FOUND' })
                }
            }
            throw new InternalServerErrorException()
        }

    }
}
