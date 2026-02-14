export async function getLandingData() {
    const data = await fetch('http://localhost:4000/product')
    const productsArray = await data.json()
    console.log(productsArray)
    return productsArray
}