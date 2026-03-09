export async function localSignUp({ email, password }: { email: string, password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/local/signup`, {
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
    return
}

export async function localSignIn({ email, password }: { email: string, password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/local/signIn`, {
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
    return
}

export async function refresh() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('REFRESH TOKEN FAILED')
    }
    return
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
