'use client'

import { useAccessTokenStore } from "@/services/stores/accessTokenStore"
import { useTotalCartItemStore } from "@/services/stores/totalCartItemStore"
import { useEffect } from "react"

export default function AuthInitializer({ accessToken, totalCartItemQuantity }: { accessToken: string | null, totalCartItemQuantity: number | null }) {
    const setAccessToken = useAccessTokenStore((state) => state.setAccessToken)
    const setTotalCartItemStore = useTotalCartItemStore((state) => state.setTotalCartItem)
    useEffect(() => {
        if (!!accessToken && !!totalCartItemQuantity) {
            setAccessToken(accessToken)
            setTotalCartItemStore(totalCartItemQuantity)
        }
    }, [accessToken, setAccessToken, totalCartItemQuantity, setTotalCartItemStore])
    return null
}