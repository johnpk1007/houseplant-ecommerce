'use client'

import Image from "next/image"
import { CartItem } from "@/types/cartItem"

export default function CartItemImage({ cartItemsArray, page }: { cartItemsArray: CartItem[] | null | undefined, page: number }) {
    const itemsPerPage = 4
    let maxPage: number = cartItemsArray ? Math.ceil(cartItemsArray.length / itemsPerPage) - 1 : 0
    if (!!cartItemsArray) {
        maxPage = Math.ceil(cartItemsArray.length / itemsPerPage) - 1
    }
    const show =
        cartItemsArray &&
        page === maxPage &&
        cartItemsArray.length % 4 === 1

    return (
        <div className="w-[40%] ml-[10%] h-full overflow-hidden relative 1300px:block hidden shrink-0">
            <div className="h-full w-full flex flex-row-reverse justify-start items-start transition-transform duration-300" style={{
                transform: `translateX(${page * 100}%)`
            }}>
                {!!cartItemsArray &&
                    Array.from({ length: Math.ceil(cartItemsArray.length / 4) }).map((_, pageIndex) => (
                        <div key={pageIndex} className="flex flex-row-reverse w-full h-full gap-[20px] flex-shrink-0 border-2 border-white">
                            {cartItemsArray
                                .slice(pageIndex * 4, pageIndex * 4 + 4)
                                .map(cartItem => (
                                    <div key={cartItem.id} className="w-[calc((100%-60px)/4)] h-full flex-shrink-0">
                                        <Image src={cartItem.product.url} alt="Product" width={0} height={0} className={`w-full h-full object-cover "}`} />
                                    </div>
                                ))}
                        </div>
                    ))}
            </div>
            <div className={`flex flex-col w-[70%] items-between absolute bottom-0 left-0 duration-300 ${show ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
                <div className="font-bebasNeue text-[64px]">01</div>
                <div className="font-roboto text-[15px] text-[#ADADAD] font-light">Review your selection. Please double-check your items, quantities, and plant care details before moving forward to secure payment and delivery scheduling.</div>
            </div>
        </div>
    )
}