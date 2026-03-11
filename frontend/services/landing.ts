export async function getLandingData() {
    const response = await fetch('http://localhost:4000/product')
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}