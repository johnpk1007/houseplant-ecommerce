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

    return (
        <div className="w-full flex flex-col justify-start items-center 970px:pt-[90px] pt-[40px]">
            {allOrder && [...allOrder].toReversed().map((order, index) =>
                <Container key={index} order={order} />
            )}
        </div>)
}