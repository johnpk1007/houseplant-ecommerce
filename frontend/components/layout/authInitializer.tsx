'use client'

import { useAccessTokenStore } from "@/services/stores/accessTokenStore"
import { useEffect } from "react"

export default function AuthInitializer({ accessToken }: { accessToken: string }) {
    const setAccessToken = useAccessTokenStore((state) => state.setAccessToken)
    useEffect(() => { setAccessToken(accessToken) }, [accessToken, setAccessToken])
    return null
}