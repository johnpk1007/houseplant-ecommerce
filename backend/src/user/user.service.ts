import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from "bcrypt"

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
        return await this.prismaService.user.findUniqueOrThrow({
            where: { email }
        })
    }
}
