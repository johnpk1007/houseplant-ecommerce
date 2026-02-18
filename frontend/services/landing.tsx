export async function getLandingData() {
    const data = await fetch('http://localhost:4000/product')
    const productsArray = await data.json()
    return productsArray
}