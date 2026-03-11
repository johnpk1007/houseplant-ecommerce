export async function getProductData({ product }: { product: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/product/${product}`)
    const data = await response.json()
    if (!response.ok) {
        throw new Error(data.message)
    }
    return data
}
