export async function localSignUp({ email, password }: { email: string, password: string }) {
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/auth/local/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
    }
    return
}

export async function localSignIn({ email, password }: { email: string, password: string }) {
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/auth/local/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    })
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message)
    }
    return
}

export async function refresh() {
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('REFRESH TOKEN FAILED')
    }
    return
}

export async function signOut() {
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('SIGN OUT FAILED')
    }
    return
}
