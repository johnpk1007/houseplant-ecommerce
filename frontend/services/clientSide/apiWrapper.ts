import { refresh, signOut } from "./auth"

export async function apiWrapper(input: string, init: RequestInit = {}) {
    let response = await fetch(input, { ...init })
    let data = await response.json()
    if (!response.ok) {
        if (response.status === 401) {
            await refresh()
            response = await fetch(input, { ...init })
            data = await response.json()
            if (!response.ok) {
                if (response.status === 401) {
                    await signOut()
                    throw new Error('REFRSEH TOKEN EXPIRED')
                } else {
                    throw new Error(data.message)
                }
            }
        } else {
            throw new Error(data.message)
        }
    }

    return data
}

