import { AddressState } from "@/types/addressState";
import { apiWrapper } from "./apiWrapper";

export async function createCartItem({ productId, quantity }: { productId: number, quantity: number }) {
    return await apiWrapper(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
            credentials: 'include'
        });
}

export async function getAllCartItem() {
    return await apiWrapper(
        `${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
            method: 'GET',
            credentials: 'include'
        },
    );
}

export async function editCartItem({ cartItemId, quantity }: { cartItemId: number, quantity: number }) {
    return await apiWrapper(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
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
    return await apiWrapper(`${process.env.NEXT_PUBLIC_NEST_API_URL}/cart-item`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemId }),
            credentials: 'include'
        });
}

export async function createPaymentIntent({ cartItemIdArray, addressState }: { cartItemIdArray: number[], addressState: AddressState }) {
    return await apiWrapper(`${process.env.NEXT_PUBLIC_NEST_API_URL}/payment`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cartItemIdArray, addressState }),
            credentials: 'include'
        });
}
