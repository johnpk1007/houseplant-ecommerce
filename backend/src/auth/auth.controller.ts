import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LocalGuard, JwtGuard, RolesGuard } from "./guard";
import { User } from "./decorator";
import type { AuthUser } from "./type";
import { Roles } from "../common/decorator/role.decorator";
import { Role } from "../common/enum/role.enum";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    signup(@Body() authDto: AuthDto) {
        return this.authService.signUp(authDto)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(LocalGuard)
    @Post('signin')
    signin(@User() user: AuthUser) {
        return this.authService.signIn(user)
    }

    @Roles(Role.Customer)
    @UseGuards(JwtGuard, RolesGuard)
    @Get('profile')
    getProfile(@User() user: AuthUser) {
        return user;
    }
}