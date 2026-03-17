import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20'
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private userService: UserService
    ) {
        super({
            clientID: configService.getOrThrow('GOOGLE_CLIENT_ID'),
            clientSecret: configService.getOrThrow('GOOGLE_CLIENT_SECRET'),
            callbackURL: configService.getOrThrow(
                configService.get('NODE_ENV') === 'production'
                    ? 'PRODUCTION_BACKEND_CALLBACK_URL'
                    : 'BACKEND_CALLBACK_URL'
            ),
            scope: ['email', 'profile'],
            passReqToCallback: true,
        });
    }
    async validate(request: Request, accessToken: string, refreshToken: string, profile: Profile) {
        if (!profile.emails?.[0]?.value) {
            throw new Error('NO EMAIL IN GOOGLE PROFILE');
        }
        const user = await this.userService.findUser({ email: profile.emails?.[0]?.value })
        if (user === null) {
            return { kind: 'PRE_AUTH', email: profile.emails?.[0]?.value }
        }
        if (user.hash || user.provider === 'LOCAL') {
            throw new UnauthorizedException('LOCAL USER')
        }
        const { hash, ...editedUser } = user
        return { kind: 'AUTH', ...editedUser }
    }
}