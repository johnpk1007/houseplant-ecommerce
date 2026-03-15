import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeJwt } from 'jose';
import cookie from 'cookie';

async function refreshAccessToken(refreshToken: string, request: NextRequest) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Cookie': `refresh_token=${refreshToken}` }
    });
    if (!response.ok) {
        return NextResponse.redirect(new URL('/auth', request.url));
    }
    const setCookieHeader = response.headers.get('set-cookie');
    if (setCookieHeader) {
        const parsed = cookie.parse(setCookieHeader);
        const accessToken = parsed.access_token;
        const refreshToken = parsed.refresh_token;
        const newResponse = NextResponse.next();
        if (accessToken) {
            newResponse.cookies.set('access_token', accessToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 15 * 60 * 1000,
                    path: '/'
                });
        }
        if (refreshToken) {
            newResponse.cookies.set('refresh_token', refreshToken,
                {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'lax',
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                });
        }
        return newResponse;
    }
}

export async function proxy(request: NextRequest) {
    const accessToken = request.cookies.get('access_token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value;
    if (!refreshToken) {
        const protectedPaths = ['/cart', '/complete', '/order']
        if (protectedPaths.includes(request.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/auth', request.url))
        }
        return
    }
    if (!accessToken || decodeJwt(accessToken).exp! <= Math.floor(Date.now() / 1000)) {
        return refreshAccessToken(refreshToken, request);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/cart', '/complete', '/order', '/product/:path*']
}