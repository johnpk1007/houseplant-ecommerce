import { OrderItem } from "./orderItem"

enum OrderStatus {
    Pending = 'PENDING',
    Paid = 'PAID',
    Failed = 'FAILED'
}

export type Order = {
    administrativeAreaLevel1: string
    cartItems: number[]
    createdAt: string
    extendedAddress: string
    firstName: string
    id: number
    lastName: string
    locality: string
    orderItems: OrderItem[]
    orderStatus: OrderStatus
    paymentIntentId: string
    phoneNumber: string
    postalCode: string
    streetAddress: string
    updatedAt: string
    userId: number
}
