import { requestWithAccessToken } from "./api/api";

export async function getOrder({ paymentIntentId }: { paymentIntentId: string }) {
    return await requestWithAccessToken(`${process.env.NEXT_PUBLIC_NEST_API_URL}/order`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ paymentIntentId }),
            credentials: 'include'
        });
}