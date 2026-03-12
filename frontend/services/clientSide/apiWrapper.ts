import { refresh, signOut } from "./auth"

export async function apiWrapper(input: string, init: RequestInit = {}) {
    let response = await fetch(input, { ...init })
    if (!response.ok) {
        if (response.status === 401) {
            await refresh()
            response = await fetch(input, { ...init })
            if (!response.ok) {
                if (response.status === 401) {
                    await signOut()
                    throw new Error('REFRSEH TOKEN EXPIRED')
                } else {
                    throw new Error('REFRESH FAILED')
                }
            }
        } else {
            throw new Error('REFRESH FAILED')
        }
    }
    return response
}

