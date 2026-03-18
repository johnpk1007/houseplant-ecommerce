'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useEffect } from "react"
import { CartItem } from "@/types/cartItem"

export default function AuthInitializer({ initialCart }: { initialCart: CartItem[] | null }) {
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    useEffect(() => {
        if (!!initialCart) {
            setCartItemsArray(initialCart)
        }
    }, [initialCart, setCartItemsArray])
    return null
}