'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import Image from "next/image"

export default function Cart() {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)

    return (
        <div className="w-full flex flex-row justify-center items-start 1100px:h-[950px] 750px:h-[560px] 500px:h-[380px]">
            <div className="flex-1 h-full flex flex-row justify-end items-center">
                {
                    !!cartItemsArray &&
                    cartItemsArray.map(cartItem => {
                        return (<div key={cartItem.id} className="w-[200px] h-[700px] ml-[20px] bg-[#F0F0F0]">
                            <Image src={cartItem.product.url} alt="Product" width={0} height={0} className={`w-full h-full object-cover "}`} />
                        </div>)
                    })
                }
                <div className="w-[200px] h-[700px] ml-[20px] bg-[#F0F0F0]">

                </div>
            </div>
            <div className="flex-1 h-full"></div>
        </div>
    )
}