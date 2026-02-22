export async function signUp({ email, password }: { email: string, password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('SIGN UP FAILED')
    }
    const { access_token } = await response.json()
    return access_token
}

export async function signIn({ email, password }: { email: string, password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('SIGN IN FAILED')
    }
    const { access_token } = await response.json()
    return access_token
}

export async function refresh() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('REFRESH TOKEN FAILED')
    }
    const data = await response.json()
    return data.access_token
}

export async function signOut() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('SIGN OUT FAILED')
    }
    return
}