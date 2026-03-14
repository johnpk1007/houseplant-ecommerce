import { getAllOrder } from "@/services/serverSide/order"
import OrderClient from "./orderClient"

export default async function Cart() {
    const allOrder = await getAllOrder()
    return <OrderClient allOrder={allOrder} />
}