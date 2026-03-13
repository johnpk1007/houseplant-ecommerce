'use client'

import { getAllOrder } from "@/services/clientSide/order"
import { useEffect, useState } from "react";
import Container from "@/components/order/container";

export default function Order() {
    const [allOrder, setAllOrder] = useState<any[]>()
    useEffect(() => {
        const getAllOrderWrapper = async () => {
            const data = await getAllOrder()
            setAllOrder(data)
        }
        getAllOrderWrapper()
    }, [])
    const dateNow = Date.now(); // 숫자로 저장
    const newDate = new Date(dateNow);
    const updatedAt = newDate.toString()
    const noOrder = {
        orderItems: [],
        updatedAt
    }

    return (
        <div className={`w-full flex flex-col justify-start items-center 970px:pt-[90px] ${allOrder && allOrder.length !== 0 && 'pt-[40px]'}`}>
            {allOrder && [...allOrder].filter((item) => item.orderStatus === 'PAID').toReversed().map((order, index) =>
                <Container key={index} order={order} />
            )}
            {allOrder && allOrder.length === 0 && <Container order={noOrder} />}
        </div>)
}