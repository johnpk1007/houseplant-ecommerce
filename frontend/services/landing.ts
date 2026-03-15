export async function getLandingData() {
    const response = await fetch(`${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_BACKEND_URL : process.env.NEXT_PUBLIC_DEV_BACKEND_URL}/product`)
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}