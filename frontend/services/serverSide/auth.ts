'use server'

export async function signOut() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/signout`, {
        method: 'POST',
    })
    if (!response.ok) {
        throw new Error('SIGN OUT FAILED')
    }
    return
}
