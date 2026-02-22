'use client'

import { useAccessTokenStore } from "../stores/accessTokenStore"
import { refresh, signOut } from "../auth"

export async function requestWithAccessToken(input: string, init: RequestInit = {}, initialAccessToken?: string) {
    let accessToken = useAccessTokenStore.getState().accessToken
    const setAccessToken = useAccessTokenStore.getState().setAccessToken
    if (!accessToken && !initialAccessToken) {
        throw new Error('NO ACCESS TOKEN')
    }
    if (!accessToken && !!initialAccessToken) {
        accessToken = initialAccessToken
    }
    const headerWithAccessToken = { ...init.headers, Authorization: `Bearer ${accessToken}` }

    const response = await fetch(input, {
        ...init, headers: headerWithAccessToken
    })
    let data = await response.json()
    if (response.status === 400) {
        if (data.message === 'NOT ENOUGH STOCK') {
            throw new Error('NOT ENOUGH STOCK')
        }
    }
    if (response.status === 401) {
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
    return data
}