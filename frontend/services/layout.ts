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
        throw new Error('REFRESH TOKEN FAILED')
    }
    const data = await response.json()
    return data.access_token
}

export async function getAllCartItem({ accessToken }: { accessToken: string }) {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (!refreshToken) return null;
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`, {
        method: 'GET',
        headers: {
            Cookie: `refresh_token=${refreshToken}`,
            Authorization: `Bearer ${accessToken}`
        },
    });
    if (!response.ok) {
        throw new Error('GET ALL CART ITEMS FAILED')
    }
    const data = await response.json()
    return data
}