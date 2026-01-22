import { ForbiddenException, Injectable } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        // private config: ConfigService,
        private userService: UserService,
    ) { }

    async signUp(dto: AuthDto) {
        try {
            const user = await this.userService.createUser(dto.email, dto.password)
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
        const user = await this.userService.findUser(email)
        const pwMatches = await bcrypt.compare(password, user.hash)
        if (!pwMatches) {
            throw new ForbiddenException(
                'Credentials incorrect'
            )
        }
        return user
    }

    // async signToken(id: number, email: string): Promise<{ access_token: string }> {
    //     const payload = {
    //         sub: id,
    //         email
    //     }
    //     const secret = this.config.get("SECRET")
    //     const token = await this.jwtService.signAsync(payload, {
    //         expiresIn: '30m',
    //         secret: secret
    //     })
    //     return {
    //         access_token: token
    //     }
    // }
}