import { refresh, signOut } from "./auth"

export async function apiWrapper(input: string, init: RequestInit = {}) {
    const response = await fetch(input, { ...init })
    let data = await response.json()
    if (response.status === 401) {
        try {
            await refresh()
            const response = await fetch(input, { ...init })
            data = await response.json()
        } catch (error) {
            if (error instanceof Error && error.message === 'Unauthorized') {
                await signOut()
                throw new Error('REFRESH TOKEN EXPIRED')
            }
            throw new Error('REQUEST FAILED')
        }
    }
    return data
}