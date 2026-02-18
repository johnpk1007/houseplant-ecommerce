export async function getProductData({ product }: { product: string }) {
    const data = await fetch(`http://localhost:4000/product/${product}`)
    const productData = await data.json()
    return productData
}