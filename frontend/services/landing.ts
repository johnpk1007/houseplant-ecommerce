export async function getLandingData() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/product`)
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}