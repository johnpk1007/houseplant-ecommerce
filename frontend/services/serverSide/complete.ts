import { cookies } from "next/headers"

export async function getOrder({ paymentIntentId }: { paymentIntentId: string }) {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order`, {
        method: 'POST',
        headers: {
            'Cookie': cookiesHeader,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentIntentId }),
        credentials: 'include'
    })
    if (!response.ok) {
        return null
    }
    const data = await response.json()
    return data
}