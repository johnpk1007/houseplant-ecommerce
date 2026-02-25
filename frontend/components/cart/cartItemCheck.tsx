'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import Image from "next/image"
import { CartItem } from "@/types/cartItem"
import { useRef, useState } from "react"
import Right from "@/public/icons/right.svg"
import Left from "@/public/icons/left.svg"
import MinusButton from "@/components/cart/minusButton"
import PlusButton from "@/components/cart/plusButton"

export default function CartItemCheck() {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const [page, setPage] = useState(0)
    const [url, setUrl] = useState<string | null>(null)
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
    const show =
        cartItemsArray &&
        page === maxPage &&
        cartItemsArray.length % 4 === 1

    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
    }

    return (
        <div className="w-full flex flex-row 970px:justify-start justify-center items-start 1700px:h-[950px] 1500px:h-[650px] h-[560px]">
            <div className="w-[45%] ml-[5%] h-full pt-[5%] overflow-hidden relative 1300px:block hidden">
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
            <div className="w-[45%] ml-[5%] h-full py-[5%] 1300px:hidden 970px:flex hidden flex-row justify-end">
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
            <div className="970px:w-[40%] 500px:w-[60%] w-[80%] h-full pt-[5%] 970px:mr-[10%] 1300px:pl-[80px] 970px:pl-[60px] flex flex-col">
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
                            <div className="font-roboto font-bold  750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] rounded-full border-white border-2 text-[16px] flex justify-center items-center ml-[10px] shrink-0">$</div>
                            <div className="font-roboto font-bold  750px:text-[16px] text-[12px] ml-[8px] text-nowrap">PROCEED TO CHECKOUT</div>
                            <span ref={spanRef} className="w-[20px] h-[20px] absolute" style={{ left, top }}></span>
                        </button>
                    </div>}
            </div>
        </div >
    )
}