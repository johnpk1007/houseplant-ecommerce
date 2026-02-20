export async function getProductData({ product }: { product: string }) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/product/${product}`)
    const productData = await data.json()
    return productData
}

export async function createCart({ product }: { product: string }) {
    const data = await fetch(`${process.env.NEXT_PUBLIC_NEST_API_URL}/product/${product}`)
    const productData = await data.json()
    return productData
}
