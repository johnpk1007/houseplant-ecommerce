import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthDto } from "./dto";
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService,
        private configService: ConfigService
    ) { }

    async signUp({ dto }: { dto: AuthDto }) {
        const refreshTokenPayload = {
            email: dto.email,
        }
        const refresh_token = this.jwtService.sign(refreshTokenPayload, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '7d' })
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        const { hash, ...user } = await this.userService.createUser({ email: dto.email, password: dto.password, hashedRefreshToken })
        const accessTokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        const access_token = this.jwtService.sign(accessTokenPayload)
        return {
            access_token,
            refresh_token
        };
    }

    async signIn({ user }: { user: any }) {
        const accessTokenPayload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        const refreshTokenPayload = {
            email: user.email,
        }
        const access_token = this.jwtService.sign(accessTokenPayload)
        const refresh_token = this.jwtService.sign(refreshTokenPayload, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '7d' })
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        await this.userService.updateUser({ email: user.email, dto: { hashedRefreshToken } })
        return {
            access_token,
            refresh_token
        };
    }

    async validateRefreshToken({ refreshToken }: { refreshToken: string }) {
        const payload = this.jwtService.verify(refreshToken, { secret: this.configService.get('JWT_REFRESH_SECRET') })
        const user = await this.userService.findUser({ email: payload.email })
        const valid = await bcrypt.compare(refreshToken, user.hashedRefreshToken as string)
        if (!valid) {
            throw new UnauthorizedException()
        }
        return user
    }

    async invalidateRefreshToken({ refreshToken }: { refreshToken: string }) {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: this.configService.get('JWT_REFRESH_SECRET'), ignoreExpiration: true })
            const user = await this.userService.findUser({ email: payload.email })
            if (user.hashedRefreshToken === null) {
                return
            }
            const valid = await bcrypt.compare(refreshToken, user.hashedRefreshToken)
            if (valid) {
                await this.userService.updateUser({ email: payload.email, dto: { hashedRefreshToken: null } })
            }
        } catch (error) {
            return
        }
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