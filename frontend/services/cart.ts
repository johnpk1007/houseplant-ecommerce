import { requestWithAccessToken } from "./api/api";

export async function createCartItem({ productId, quantity }: { productId: number, quantity: number }) {
    return await requestWithAccessToken(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
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

export async function editCartItem({ cartItemId, quantity }: { cartItemId: number, quantity: number }) {
    return await requestWithAccessToken(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemId, quantity }),
            credentials: 'include'
        });
}

export async function deleteCartItem({ cartItemId }: { cartItemId: number }) {
    return await requestWithAccessToken(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemId }),
            credentials: 'include'
        });
}