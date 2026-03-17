import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Req, Res, UnauthorizedException, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthDto, GooglelAuthDto } from "./dto";
import { LocalGuard } from "./guard";
import { User } from "../common/decorator";
import type { AuthUser, GoogleAuthUser, PreGoogleAuthUser } from "../common/type";
import type { Request, Response } from "express";
import { GoogleGuard } from "./guard/google.guard";
import { ConfigService } from "@nestjs/config";

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private configService: ConfigService
    ) { }

    @Post('local/signup')
    async localSignUp(@Body() dto: LocalAuthDto, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.localSignUp({ dto })
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 15 * 60 * 1000,
            path: '/'
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }

    @Post('local/signin')
    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.OK)
    async localSignIn(@User() user: AuthUser, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.signIn({ user })
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 15 * 60 * 1000,
            path: '/'
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
    }

    @Get('google/signin')
    async googleSignIn(@Query('returnUrl') returnUrl: string, @Res({ passthrough: true }) res: Response) {
        if (!returnUrl.startsWith('/')) returnUrl = '/';
        res.cookie('redirect_url', returnUrl, { httpOnly: true, sameSite: 'none' });
        res.redirect('/auth/google/redirect');
    }

    @Get('google/redirect')
    @UseGuards(GoogleGuard)
    async googleAuth() { }

    @Get('google/callback')
    @UseGuards(GoogleGuard)
    @HttpCode(HttpStatus.OK)
    async googleCallback(@User() user: GoogleAuthUser | PreGoogleAuthUser, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
        let access_token: string = '';
        let refresh_token: string = '';
        if (user.kind === 'PRE_AUTH') {
            const result = await this.authService.googleSignUp({ email: user.email })
            access_token = result.access_token
            refresh_token = result.refresh_token
        } else if (user.kind === 'AUTH') {
            const result = await this.authService.signIn({ user })
            access_token = result.access_token
            refresh_token = result.refresh_token
        }
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 15 * 60 * 1000,
            path: '/'
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        const redirectUrl = req.cookies.redirect_url || '/';
        res.clearCookie('redirect_url');
        res.redirect(`${this.configService.getOrThrow<string>('FRONTEND_CALLBACK_URL')}${redirectUrl}`)
        return
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token']
        if (!refreshToken) {
            throw new UnauthorizedException({ message: 'NO REFRESH TOKEN' })
        }
        const user = await this.authService.validateRefreshToken({ refreshToken })
        const { access_token, refresh_token } = await this.authService.signIn({ user })
        res.cookie('access_token', access_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 15 * 60 * 1000,
            path: '/'
        })
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        return
    }

    @Post('signout')
    @HttpCode(HttpStatus.OK)
    async signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies['refresh_token']
        if (!refreshToken) {
            return
        }
        await this.authService.invalidateRefreshToken({ refreshToken })
        res.clearCookie('access_token', {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
            path: '/'
        })
        res.clearCookie('refresh_token', {
            httpOnly: true,
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'none',
        })
        return
    }
}