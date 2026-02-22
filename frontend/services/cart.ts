import { requestWithAccessToken } from "./api/api";

export async function createCartItem({ productId, quantity }: { productId: number, quantity: number }) {
    return await requestWithAccessToken(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
        credentials: 'include'
    });
}

export async function getAllCartItem({ accessToken }: { accessToken?: string }) {
    return await requestWithAccessToken(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
            method: 'GET',
            credentials: 'include'
        },
        accessToken
    );
}