import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LocalGuard } from "./guard";
import { User } from "../common/decorator";
import type { AuthUser } from "../common/type";
import type { Request, Response } from "express";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.signUp({ dto })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return { access_token }
    }

    @Post('signin')
    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.OK)
    async signin(@User() user: AuthUser, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.signIn({ user })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return { access_token }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token']
        if (!refreshToken) {
            throw new UnauthorizedException()
        }
        const user = await this.authService.validateRefreshToken({ refreshToken })
        const { access_token, refresh_token } = await this.authService.signIn({ user })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return { access_token }
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token']
        if (!refreshToken) {
            return
        }
        await this.authService.invalidateRefreshToken({ refreshToken })
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        })
        return
    }
}