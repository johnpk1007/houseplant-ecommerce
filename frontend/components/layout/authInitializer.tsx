'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useEffect } from "react"
import { CartItem } from "@/types/cartItem"

export default function AuthInitializer({ cartItemsArray }: { cartItemsArray: CartItem[] | null }) {
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    useEffect(() => {
        if (!!cartItemsArray) {
            setCartItemsArray(cartItemsArray)
        }
    }, [cartItemsArray, setCartItemsArray])
    return null
}