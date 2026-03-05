'use client'

import { getAllOrder } from "@/services/order"
import { useAccessTokenStore } from "@/services/stores/accessTokenStore";
import { useEffect, useState } from "react";


export default function Order() {
    const [allOrder, setAllOrder] = useState<any[]>()
    const accessToken = useAccessTokenStore((state => state.accessToken))
    useEffect(() => {
        const getAllOrderWrapper = async () => {
            if (accessToken) {
                const data = await getAllOrder({ accessToken })
                setAllOrder(data)
            }
        }
        getAllOrderWrapper()
    }, [accessToken])

    console.log(allOrder)

    return (
        <div className="w-full 1700px:h-[950px] h-[700px] flex flex-row justify-center items-start">
            {allOrder && allOrder.map((order) =>
                <div>
                    <div>{order.updatedAt}</div>
                    {order.orderItems.map((orderItem: any) => {
                        <div>
                            {orderItem.product}
                        </div>

                    })}
                </div>
            )}
        </div>)
}