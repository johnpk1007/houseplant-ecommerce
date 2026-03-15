import { AddressState } from "@/types/addressState";
import { apiWrapper } from "./apiWrapper";

export async function createCartItem({ productId, quantity }: { productId: number, quantity: number }) {
    const response = await apiWrapper(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/cart-item`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
            credentials: 'include'
        });
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}

export async function getAllCartItem() {
    const response = await apiWrapper(
        `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/cart-item`,
        {
            method: 'GET',
            credentials: 'include'
        },
    );
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}

export async function editCartItem({ cartItemId, quantity }: { cartItemId: number, quantity: number }) {
    const response = await apiWrapper(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/cart-item`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemId, quantity }),
            credentials: 'include'
        });
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}

export async function deleteCartItem({ cartItemId }: { cartItemId: number }) {
    const response = await apiWrapper(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/cart-item`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemId }),
            credentials: 'include'
        });
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return
}

export async function createPaymentIntent({ cartItemIdArray, addressState }: { cartItemIdArray: number[], addressState: AddressState }) {
    const response = await apiWrapper(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/payment`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemIdArray, addressState }),
            credentials: 'include'
        });
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}
