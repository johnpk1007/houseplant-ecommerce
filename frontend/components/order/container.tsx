'use client'

import OrderList from "./orderList"
import OrderImage from "./orderImage"
import { useState } from "react"

export default function Container({ order }: { order: { orderItems: { product: { name: string, description: string, url: string }, }[], updatedAt: string } }) {
    const [page, setPage] = useState(0)
    const [index, setIndex] = useState<number>()
    return (
        <div className="1700px:w-[80%] 1300px:w-[70%] 970px:w-[80%] w-[400px] flex 970px:flex-row flex-col 970px:gap-[20px] 1400px:mb-[90px] 970px:mb-[60px] mb-[30px] justify-center 970px:shadow-none shadow-sm">
            <div className="970px:w-1/2 w-full aspect-square 970px:shadow-sm">
                <OrderImage page={page} orderItems={order.orderItems} index={index} />
            </div>
            <div className="970px:w-1/2 400px:w-full w-[350px] 970px:aspect-square aspect-7/4 flex flex-col items-center overflow-hidden 970px:shadow-sm bg-white">
                <OrderList updatedAt={order.updatedAt} orderItems={order.orderItems} page={page} setPage={setPage} setIndex={setIndex} />
            </div>
        </div>)
}