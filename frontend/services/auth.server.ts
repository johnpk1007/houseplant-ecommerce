import { cookies } from 'next/headers';

export async function initialRefresh() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (!refreshToken) return null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            Cookie: `refresh_token=${refreshToken}`,
        },
    });
    if (!response.ok) {
        throw new Error('refresh failed')
    }
    const data = await response.json()
    return data.access_token
}
