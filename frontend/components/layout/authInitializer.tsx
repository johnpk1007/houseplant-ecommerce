'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useSignedInStore } from "@/services/stores/signedInStore"
import { useEffect } from "react"
import { CartItem } from "@/types/cartItem"

export default function AuthInitializer({ initialCart }: { initialCart: CartItem[] | null }) {
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    const setSigneIn = useSignedInStore((state) => state.setIsSignedIn)
    useEffect(() => {
        if (!!initialCart) {
            setCartItemsArray(initialCart)
            setSigneIn(true)
        }
    }, [initialCart, setCartItemsArray, setSigneIn])
    return null
}