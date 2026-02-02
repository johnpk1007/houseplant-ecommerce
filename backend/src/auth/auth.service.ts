import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
    ) { }

    async signUp({ dto }: { dto: AuthDto }) {
        const { hash, ...user } = await this.userService.createUser({ email: dto.email, password: dto.password })
        return user
    }

    async signIn({ user }: { user: any }) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser({ email, password }: { email: string, password: string }) {
        const { hash, ...user } = await this.userService.findUser({ email })
        const pwMatches = await bcrypt.compare(password, hash)
        if (!pwMatches) {
            throw new UnauthorizedException('Invalid email or password')
        }
        return user
    }
}