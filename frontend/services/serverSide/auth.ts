export async function signOut() {
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/auth/signout`, {
        method: 'POST',
    })
    if (!response.ok) {
        throw new Error('SIGN OUT FAILED')
    }
    return
}
