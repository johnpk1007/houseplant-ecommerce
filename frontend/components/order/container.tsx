'use client'

import OrderList from "./orderList"
import OrderImage from "./orderImage"
import { useState } from "react"
import Empty_order from "@/public/images/Empty_order.webp"
import LoadingImageWithImageData from "../common/loadingImageWithImageData"

export default function Container({ order }: { order: { orderItems: { product: { name: string, description: string, url: string }, }[], updatedAt: string } }) {
    const [page, setPage] = useState(0)
    const [index, setIndex] = useState<number>()
    return (
        <div className={`1700px:w-[80%] 1300px:w-[70%] 970px:w-[80%] 500px:w-[400px] w-full flex 970px:flex-row flex-col 970px:gap-[20px] 1400px:mb-[90px] 970px:mb-[60px] mb-[30px] justify-center 970px:shadow-none ${order.orderItems.length !== 0 ? 'shadow-sm' : '500px:h-auto h-screen'} relative`}>
            <div className={`970px:w-1/2 w-full aspect-square ${order.orderItems.length !== 0 && '970px:shadow-sm'} z-1`}>
                <OrderImage page={page} orderItems={order.orderItems} index={index} />
            </div>
            <div className={`970px:w-1/2 400px:w-full w-[350px] 970px:aspect-square aspect-7/4 flex flex-col items-center overflow-hidden ${order.orderItems.length !== 0 && '970px:shadow-sm'} bg-white`}>
                <OrderList updatedAt={order.updatedAt} orderItems={order.orderItems} page={page} setPage={setPage} setIndex={setIndex} />
            </div>
            {!!order.orderItems && order.orderItems.length === 0 && <div className={`absolute z-2 970px:top-[55%] top-[35%] left-[50%] -translate-1/2 font-vogue 1100px:text-[120px] 970px:text-[100px] text-[60px] text-[#ECECEC] 970px:text-nowrap leading-none`}>NO ORDER HISTORY</div>}
            {!!order.orderItems && order.orderItems.length === 0 && <div className="970px:w-1/2 w-full h-full absolute top-0 right-0 z-0 970px:block hidden"><LoadingImageWithImageData imageData={Empty_order} /></div>}
        </div>
    )
}