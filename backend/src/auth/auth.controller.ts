import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LocalGuard, JwtGuard } from "./guard";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() dto: AuthDto) {
        return this.authService.signUp(dto)
    }

    @UseGuards(LocalGuard)
    @Post('signin')
    signin(@Request() req) {
        return this.authService.signIn(req.user)
    }

    @UseGuards(JwtGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}