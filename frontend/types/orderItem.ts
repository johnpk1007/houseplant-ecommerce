import { Product } from "./product"

export type OrderItem = {
    id: number
    orderId: number
    price: number
    product: Product
    productId: number
    quantity: number
}
