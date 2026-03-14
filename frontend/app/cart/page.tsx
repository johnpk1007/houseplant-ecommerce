import { getAllCartItem } from "@/services/serverSide/common"
import CartClient from "./cartClient"

export default async function Cart() {
    const initialCart = await getAllCartItem()
    return <CartClient initialCart={initialCart} />
}