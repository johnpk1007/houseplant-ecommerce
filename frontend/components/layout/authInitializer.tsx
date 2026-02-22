'use client'

import { useAccessTokenStore } from "@/services/stores/accessTokenStore"
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useEffect } from "react"
import { CartItem } from "@/types/cartItem"

export default function AuthInitializer({ accessToken, cartItemsArray }: { accessToken: string | null, cartItemsArray: CartItem[] | null }) {
    const setAccessToken = useAccessTokenStore((state) => state.setAccessToken)
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    useEffect(() => {
        if (!!accessToken && !!cartItemsArray) {
            setAccessToken(accessToken)
            setCartItemsArray(cartItemsArray)
        }
    }, [accessToken, setAccessToken, cartItemsArray, setCartItemsArray])
    return null
}