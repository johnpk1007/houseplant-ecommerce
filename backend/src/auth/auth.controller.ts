import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LocalGuard, JwtGuard } from "./guard";
import { User } from "./decorator";
import type { AuthUser } from "./type";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signUp(dto)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalGuard)
    @Post('signin')
    signin(@User() user: AuthUser) {
        return this.authService.signIn(user)
    }

    @UseGuards(JwtGuard)
    @Get('profile')
    getProfile(@User() user: AuthUser) {
        return user;
    }
}