import { Controller } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { Role } from '../common/enum';
import { Roles } from '../common/decorator';
import { JwtGuard, RolesGuard } from '../common/guard';
import { Get } from '@nestjs/common';
import { User } from '../common/decorator';
import type { AuthUser } from '../common/type';

@Controller('user')
export class UserController {
    @Get('profile')
    @Roles(Role.Customer, Role.Admin)
    @UseGuards(JwtGuard, RolesGuard)
    getProfile(@User() user: AuthUser) {
        return user;
    }
}
