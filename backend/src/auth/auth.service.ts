import { ForbiddenException, Injectable } from "@nestjs/common";
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

    async signUp(authDto: AuthDto) {
        try {
            const { hash, ...user } = await this.userService.createUser(authDto.email, authDto.password)
            return user
        } catch (error) {
            throw error
        }
    }

    async signIn(user: any) {
        const payload = {
            sub: user.id,
            email: user.email
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async validateUser(email: string, password: string) {
        const { hash, ...user } = await this.userService.findUser(email)
        const pwMatches = await bcrypt.compare(password, hash)
        if (!pwMatches) {
            throw new ForbiddenException(
                'Credentials incorrect'
            )
        }
        return user
    }
}