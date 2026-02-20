'use client'

import { useAccessTokenStore } from "../stores/accessTokenStore"
import { refresh, signOut } from "../auth"

export async function requestWithAccessToken(input: string, init: RequestInit = {}) {
    const { accessToken, setAccessToken } = useAccessTokenStore.getState()
    const headerWithAccessToken = { ...init.headers, 'Authorization': `Bearer ${accessToken}` }
    if (!accessToken) {
        throw new Error('NO ACCESS TOKEN')
    }
    const response = await fetch(input, {
        ...init, headers: headerWithAccessToken
    })
    let data = await response.json()
    if (data.status === 400) {
        if (data.message === 'PRODUCT OUT OF STOCK') {
            throw new Error('PRODUCT OUT OF STOCK')
        }
    }
    if (data.status === 401) {
        try {
            const newAccessToken = await refresh()
            setAccessToken(newAccessToken)
            const headerWithNewAccessToken = { 'Authorization': `Bearer ${newAccessToken}`, ...init.headers }
            const response = await fetch(input, {
                ...init, headers: headerWithNewAccessToken
            })
            data = await response.json()
        } catch (error) {
            if (error instanceof Error && error.message === 'Unauthorized') {
                setAccessToken(null)
                await signOut()
                throw new Error('REFRESH TOKEN EXPIRED')
            }
            throw new Error('REQUEST FAILED')
        }
    }
    console.log('data:', data)
    return data
}