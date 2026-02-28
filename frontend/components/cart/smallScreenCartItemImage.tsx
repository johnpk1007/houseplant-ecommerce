'use client'

import Image from "next/image"
import { CartItem } from "@/types/cartItem"
import { SetStateAction, useState } from "react"

export default function SmallScreenCartItemImage({ cartItemsArray, page, url, setUrl }: { cartItemsArray: CartItem[] | null | undefined, page: number, url: string | null, setUrl: React.Dispatch<SetStateAction<string | null>> }) {
    const itemsPerPage = 4
    let maxPage: number = cartItemsArray ? Math.ceil(cartItemsArray.length / itemsPerPage) - 1 : 0
    if (!!cartItemsArray) {
        maxPage = Math.ceil(cartItemsArray.length / itemsPerPage) - 1
    }
    return (
        <div className="w-[40%] ml-[10%] h-full pb-[5%] 1300px:hidden 970px:flex hidden flex-row justify-end shrink-0">
            <div className="h-full aspect-8/10 flex flex-row justify-end overflow-hidden">
                <div className="h-full w-full flex flex-row-reverse justify-start items-start transition-transform duration-300" style={{
                    transform: `translateX(${page * 100}%)`
                }}>
                    {!!cartItemsArray &&
                        Array.from({ length: Math.ceil(cartItemsArray.length / 4) }).map((_, pageIndex) => {
                            const firstItem = cartItemsArray[pageIndex * 4]
                            return (
                                <div key={pageIndex} className="flex flex-row-reverse w-full h-full gap-[20px] flex-shrink-0 border-2 border-white">
                                    <div className="w-full h-full flex-shrink-0">
                                        <div className="w-full h-[calc(80%-10px)] pb-[10px]">
                                            <Image src={(page === pageIndex && url) ? url : firstItem.product.url} alt="Product" width={0} height={0} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="w-full h-[20%] flex flex-row gap-[10px]">
                                            {cartItemsArray.slice(pageIndex * 4, pageIndex * 4 + 4).map(cartItem => (
                                                <div key={cartItem.id} className="w-[calc((100%-30px)/4)] h-[100px] flex-shrink-0 cursor-pointer" onClick={() => setUrl(cartItem.product.url)}>
                                                    <Image src={cartItem.product.url} alt="Product" width={0} height={0} className={`w-full h-full object-cover "}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>

    )
}