import { cookies } from "next/headers"

export async function getAllCartItem() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('access_token')?.value;
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (!refreshToken) {
        return null
    }
    const cookiesHeader = [
        accessToken ? `access_token=${accessToken}` : null,
        refreshToken ? `refresh_token=${refreshToken}` : null
    ].filter(Boolean).join('; ');
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/cart-item`, {
        method: 'GET',
        headers: {
            'Cookie': cookiesHeader,
        },
    })
    if (!response.ok) {
        return null
    }
    const data = await response.json()
    return data
}