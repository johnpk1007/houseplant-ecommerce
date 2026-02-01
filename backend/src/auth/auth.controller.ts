import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LocalGuard } from "./guard";
import { User } from "../common/decorator";
import type { AuthUser } from "../common/type";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signUp({ dto })
    }

    @Post('signin')
    @UseGuards(LocalGuard)
    @HttpCode(HttpStatus.OK)
    signin(@User() user: AuthUser) {
        return this.authService.signIn({ user })
    }
}