'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import Image from "next/image"
import { CartItem } from "@/types/cartItem"
import Plus from "@/public/icons/plus.svg"
import Minus from "@/public/icons/minus.svg"
import { useState } from "react"
import Right from "@/public/icons/right.svg"
import Left from "@/public/icons/left.svg"
import { editCartItem } from "@/services/cart"

export default function Cart() {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const upsertCartItem = useCartItemStore((state) => state.upsertCartItem)
    const [page, setPage] = useState(0)
    const itemsPerPage = 4
    let maxPage: number = cartItemsArray ? Math.ceil(cartItemsArray.length / itemsPerPage) - 1 : 0
    if (!!cartItemsArray) {
        maxPage = Math.ceil(cartItemsArray.length / itemsPerPage) - 1
    }

    const handleNext = () => {
        if (page < maxPage) setPage(p => p + 1)
    }
    const handlePrev = () => {
        if (page > 0) setPage(p => p - 1)
    }
    const handlePlusMinus = async ({ cartItemId, quantity }: { cartItemId: number, quantity: number }) => {
        const cartItem = await editCartItem({ cartItemId, quantity })
        upsertCartItem(cartItem)
    }


    return (
        <div className="w-full flex flex-row justify-start items-start 1100px:h-[950px] 750px:h-[560px] 500px:h-[380px]">
            <div className="w-[50%] h-full mt-[130px] overflow-hidden ">
                <div className="h-[700px] w-full flex flex-row-reverse justify-start items-start transition-transform duration-300" style={{
                    transform: `translateX(${page * 100}%)`
                }}>
                    {!!cartItemsArray &&
                        Array.from({ length: Math.ceil(cartItemsArray.length / 4) }).map((_, pageIndex) => (
                            <div key={pageIndex} className="flex flex-row-reverse w-full h-full gap-[20px] flex-shrink-0">
                                {cartItemsArray
                                    .slice(pageIndex * 4, pageIndex * 4 + 4)
                                    .map(cartItem => (
                                        <div key={cartItem.id} className="w-[calc((100%-60px)/4)] h-[700px] flex-shrink-0">
                                            <Image src={cartItem.product.url} alt="Product" width={0} height={0} className={`w-full h-full object-cover "}`} />
                                        </div>
                                    ))}
                            </div>
                        ))}
                </div>
            </div>
            <div className="w-[40%] h-full mt-[130px] mr-[10%] pl-[80px] flex flex-col">
                <div className="w-full h-[75px] border-b-[2px] border-[#E2E2E2] flex flex-row justify-between items-center">
                    <div className="font-playfairDisplay text-[36px] ">
                        Shopping Cart
                    </div>
                    <div>
                        <button className={`text-[#ADADAD] w-[20px] h-[20px] duration-300 ease-in-out ${page === 0 ? 'text-[#E2E2E2]' : 'text-[#ADADAD] hover:text-[#ADADAD]/70 cursor-pointer'}`} onClick={handlePrev}><Left /></button>
                        <button className={`text-[#ADADAD] w-[20px] h-[20px] duration-300 ease-in-out ${page === maxPage ? 'text-[#E2E2E2]' : 'text-[#ADADAD] hover:text-[#ADADAD]/70 cursor-pointer'} ml-[10px]`} onClick={handleNext}><Right /></button>
                    </div>
                </div>

                <div className="w-full h-[50%] overflow-hidden">
                    <div className="w-full h-full flex flex-col transition-transform duration-300"
                        style={{
                            transform: `translateY(-${page * 100}%)`
                        }}>
                        {
                            !!cartItemsArray &&
                            Array.from({ length: Math.ceil(cartItemsArray.length / 4) }).map((_, pageIndex) => (
                                <div key={pageIndex} className="flex flex-col w-full h-full flex-shrink-0">
                                    {cartItemsArray
                                        .slice(pageIndex * 4, pageIndex * 4 + 4)
                                        .map(cartItem => (
                                            <div key={cartItem.id} className="w-full h-1/4 flex flex-row justify-between items-center">
                                                <div className="flex flex-row items-center">
                                                    <div className="font-roboto font-light text-[16px] mr-[10px]">{cartItem.quantity}</div>
                                                    <div className="font-roboto font-light text-[16px] mr-[10px]">{cartItem.product.name}</div>
                                                    <button type="button" onClick={() => handlePlusMinus({ cartItemId: cartItem.id, quantity: cartItem.quantity - 1 })} className="border-1 border-[#ADADAD] rounded-full h-[12px] w-[11px] text-[8px] text-[#ADADAD] flex justify-center items-center mr-[5px]"><Minus /></button>
                                                    <button type="button" onClick={() => handlePlusMinus({ cartItemId: cartItem.id, quantity: cartItem.quantity + 1 })} className="border-1 border-[#ADADAD] rounded-full h-[12px] w-[11px] text-[8px] text-[#ADADAD] flex justify-center items-center"><Plus /></button>
                                                </div>
                                                <div className="font-roboto font-light text-[16px]">${cartItem.product.price}</div>
                                            </div>
                                        ))}
                                </div>
                            ))
                        }
                    </div>
                </div>
                {!!cartItemsArray &&
                    <div className="font-playfairDisplay text-[36px] h-[110px] border-t-[2px] border-[#E2E2E2] flex flex-row justify-between items-center">
                        <div className="font-roboto text-[20px]">Total</div>
                        <div className="font-roboto text-[20px]"> ${cartItemsArray.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)}</div>
                    </div>}
            </div>
        </div >
    )
}