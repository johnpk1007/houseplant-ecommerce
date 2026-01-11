import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService{
    constructor(private prisma : PrismaService){}
    async signup(dto:AuthDto){
        const hash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.customer.create({
            data:{
                email:dto.email,
                hash,
            }
        })
        return user
    }
    signin(){
        return {msg:'I have signed in'}
    }
}