export default async function signUp({ email, password }: { email: string, password: string }) {
    const data = await fetch(`${process.env.NEST_API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    if (!data.ok) {
        throw new Error('Sign up failed')
    }
    const productData = await data.json()
    return productData
}