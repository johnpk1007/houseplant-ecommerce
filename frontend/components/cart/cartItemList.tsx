'use client'

import { CartItem } from "@/types/cartItem"
import { SetStateAction, useRef, useState } from "react"
import Right from "@/public/icons/right.svg"
import Left from "@/public/icons/left.svg"
import MinusButton from "@/components/cart/minusButton"
import PlusButton from "@/components/cart/plusButton"
import Map from '@/public/icons/filledMap.svg'

export default function CartItemList({ cartItemsArray, page, setPage, setUrl, stage, setStage }: { cartItemsArray: CartItem[] | null | undefined, page: number, setPage: React.Dispatch<SetStateAction<number>>, setUrl: React.Dispatch<SetStateAction<string | null>>, stage: number, setStage: React.Dispatch<SetStateAction<number>> }) {
    const itemsPerPage = 4
    let maxPage: number = cartItemsArray ? Math.ceil(cartItemsArray.length / itemsPerPage) - 1 : 0
    if (!!cartItemsArray) {
        maxPage = Math.ceil(cartItemsArray.length / itemsPerPage) - 1
    }
    const handleNext = () => {
        if (page < maxPage) {
            setUrl(null)
            setPage(p => p + 1)
        }
    }
    const handlePrev = () => {
        if (page > 0) {
            setUrl(null)
            setPage(p => p - 1)
        }
    }
    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
        setStage(1)
    }

    return (
        <div className="970px:w-[50%] w-full h-full flex flex-row 970px:justify-start justify-center shrink-0">
            <div className="w-[5%] h-full 970px:block hidden" style={{ width: `${stage !== 0 ? '15%' : '5%'}` }} />
            <div className="970px:w-[80%] 500px:w-[60%] w-[80%] h-full flex flex-col justify-start">
                <div className="w-full h-[75px] border-b-[2px] border-[#E2E2E2] flex flex-row justify-between items-center">
                    <div className="font-playfairDisplay 1300px:text-[32px] text-[24px]">
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
                                                    <div className="font-roboto font-light 1300px:text-[16px] text-[14px] mr-[10px]">{cartItem.quantity}</div>
                                                    <div className="font-roboto font-light 1300px:text-[16px] text-[14px] mr-[10px]">{cartItem.product.name}</div>
                                                    <MinusButton cartItemId={cartItem.id} quantity={cartItem.quantity - 1} />
                                                    <PlusButton cartItemId={cartItem.id} quantity={cartItem.quantity + 1} />
                                                </div>
                                                <div className="font-roboto font-light 1300px:text-[16px] text-[14px] ">${cartItem.product.price}</div>
                                            </div>
                                        ))}
                                </div>
                            ))
                        }
                    </div>
                </div>
                {!!cartItemsArray &&
                    <div className="font-playfairDisplay h-[110px] w-full border-t-[2px] border-[#E2E2E2] flex flex-col justify-between">
                        <div className="flex flex-row w-full justify-between items-center mt-[10px]">
                            <div className="font-roboto 1300px:text-[20px] 750px:text-[18px]">Total</div>
                            <div className="font-roboto 1300px:text-[20px] 750px:text-[18px]"> ${cartItemsArray.reduce((sum: number, item: CartItem) => sum + item.product.price * item.quantity, 0)}</div>
                        </div>
                        <button type="button" onClick={handleClick} className="self-end rounded-full bg-black text-white h-[40px] 750px:w-[240px] w-[190px]  flex flex-row items-center relative overflow-hidden hover:bg-black/40 hover:border-black/10  duration-300 ease-in-out cursor-pointer border-black border-2 ">
                            <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[8px] ml-[10px] flex-shrink-0">
                                <Map />
                            </div>
                            <div className="font-roboto font-bold  750px:text-[16px] text-[12px] ml-[8px] text-nowrap">PROCEED TO CHECKOUT</div>
                            <span ref={spanRef} className="w-[20px] h-[20px] absolute" style={{ left, top }}></span>
                        </button>

                    </div>}
            </div>
        </div>

    )
}