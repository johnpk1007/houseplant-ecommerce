import { Product } from "./product"

export type CartItem = {
    cartId: number
    id: number
    product: Product
    productId: number
    quantity: number
}
