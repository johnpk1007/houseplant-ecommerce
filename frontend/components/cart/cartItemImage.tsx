'use client'

import { CartItem } from "@/types/cartItem"
import LoadingImageWithURL from "../common/loadingImageWithURL"

export default function CartItemImage({ page, cartItems }: { page: number, cartItems: CartItem[] | null }) {

    const itemsPerPage = 4
    let maxPage: number = cartItems ? Math.ceil(cartItems.length / itemsPerPage) - 1 : 0
    if (!!cartItems) {
        maxPage = Math.ceil(cartItems.length / itemsPerPage) - 1
    }
    const show =
        cartItems &&
        page === maxPage &&
        cartItems.length % 4 === 1

    return (
        <div className="w-[40%] ml-[10%] 1700px:h-full h-[80%] overflow-hidden relative 1300px:block hidden shrink-0">
            <div className="h-full w-full flex flex-row-reverse justify-start items-start transition-transform duration-300" style={{
                transform: `translateX(${page * 100}%)`
            }}>
                {!!cartItems &&
                    Array.from({ length: Math.ceil(cartItems.length / 4) }).map((_, pageIndex) => (
                        <div key={pageIndex} className="flex flex-row-reverse w-full h-full gap-[20px] flex-shrink-0 border-2 border-white">
                            {cartItems
                                .slice(pageIndex * 4, pageIndex * 4 + 4)
                                .map(cartItem => (
                                    <div key={cartItem.id} className="w-[calc((100%-60px)/4)] h-full flex-shrink-0">
                                        <LoadingImageWithURL url={cartItem.product.url} />
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