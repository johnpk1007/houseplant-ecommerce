'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useSignedInStore } from "@/services/stores/signedInStore"
import { useEffect } from "react"
import { CartItem } from "@/types/cartItem"

export default function AuthInitializer({ cartItemsArray }: { cartItemsArray: CartItem[] | null }) {
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    const setSigneIn = useSignedInStore((state) => state.setIsSignedIn)
    useEffect(() => {
        if (!!cartItemsArray) {
            setCartItemsArray(cartItemsArray)
            setSigneIn(true)
        }
    }, [cartItemsArray, setCartItemsArray, setSigneIn])
    return null
}