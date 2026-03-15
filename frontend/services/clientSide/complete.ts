import { apiWrapper } from "./apiWrapper";

export async function getOrder({ paymentIntentId }: { paymentIntentId: string }) {
    const response = await apiWrapper(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/order`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId }),
            credentials: 'include'
        });
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}
