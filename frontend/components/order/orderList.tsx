'use client'

import { Dispatch, SetStateAction } from "react"
import Right from "@/public/icons/right.svg"
import Left from "@/public/icons/left.svg"

export default function OrderList({ updatedAt, orderItems, page, setPage, setIndex }: { updatedAt: string, orderItems: any[], page: number, setPage: Dispatch<SetStateAction<number>>, setIndex: Dispatch<SetStateAction<number | undefined>> }) {
    const date = new Date(updatedAt)
    const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const itemsPerPage = 4
    const maxPage: number = orderItems ? Math.floor(orderItems.length / itemsPerPage) : 0

    const handleNext = () => {
        if (page < maxPage) {
            setPage(p => p + 1)
            setIndex(0)
        }
    }
    const handlePrev = () => {
        if (page > 0) {
            setPage(p => p - 1)
            setIndex(0)
        }
    }
    return (
        <div className="w-full h-full flex flex-col 1400px:px-[80px] 1100px:px-[60px] 970px:px-[40px] px-[7.5%] 1700px:py-[80px] 1400px:py-[60px] 1100px:py-[40px] 970px:py-[20px] pb-[20px] relative">
            <div className="w-full 1700px:h-1/2 1100px:h-2/5 970px:h-1/3 h-1/3  flex 970px:flex-col flex-row z-1">
                <div className="w-full 970px:h-3/4 h-full flex flex-col 970px:items-center items-start jusify-center">
                    <div className={`font-roboto font-light 1700px:text-[20px] 1100px:text-[14px] text-[12px] ${orderItems.length === 0 ? '970px:text-white/90 text-[#CECECE]' : '970px:text-[#ADADAD] text-black'}`}>Items purchased on</div>
                    <div className={`970px:font-playfairDisplay font-bebasNeue 1700px:text-[40px] 1100px:text-[28px] text-[24px] ${orderItems.length === 0 ? '970px:text-white/90 text-[#CECECE]' : 'text-black'}`}>{formatted}</div>
                </div>
                <div className="970px:h-1/4 h-full flex items-center">
                    <div className={`flex flex-row items-center ${maxPage === 0 && 'hidden'}`}>
                        <button className={`text-[#ADADAD] 1700px:w-[20px] w-[16px] 1700px:h-[20px] h-[16px] duration-300 ease-in-out ${page === 0 ? 'text-[#E2E2E2]' : 'text-[#ADADAD] hover:text-[#ADADAD]/70 cursor-pointer'}`} onClick={handlePrev}><Left /></button>
                        <button className={`text-[#ADADAD] 1700px:w-[20px] w-[16px] 1700px:h-[20px] h-[16px] duration-300 ease-in-out ${page === maxPage ? 'text-[#E2E2E2]' : 'text-[#ADADAD] hover:text-[#ADADAD]/70 cursor-pointer'} ml-[10px]`} onClick={handleNext}><Right /></button>
                    </div>
                </div>
            </div>

            <div className={`w-full flex-1 1400px:py-[30px] py-[10px] border-t-[2px] ${orderItems.length !== 0 ? '970px:border-[#E2E2E2] border-black' : '970px:border-white/90 border-[#CECECE]'}  z-1`}>
                <div className="w-full h-full overflow-hidden">
                    <div className="w-full h-full flex flex-col transition-transform duration-300"
                        style={{
                            transform: `translateY(-${page * 100}%)`
                        }}>
                        {
                            !!orderItems &&
                            Array.from({ length: Math.ceil(orderItems.length / 4) }).map((_, pageIndex) => (
                                <div key={pageIndex} className="flex flex-col w-full h-full flex-shrink-0">
                                    {orderItems
                                        .slice(pageIndex * 4, pageIndex * 4 + 4)
                                        .map((orderItem, index) => (
                                            <button key={index} className="w-full h-1/4 flex flex-row justify-between items-center text-black hover:bg-gray-100 duration-300 ease-in-out cursor-pointer" onClick={() => setIndex(index)}>
                                                <div className="flex flex-row items-center">
                                                    <div className="font-roboto font-light 1700px:text-[16px] text-[12px] mr-[10px]">{orderItem.quantity}</div>
                                                    <div className="font-roboto font-light 1700px:text-[16px] text-[12px] mr-[10px]">{orderItem.product.name}</div>
                                                </div>
                                                <div className="font-roboto font-light 1700px:text-[16px] text-[12px]">${orderItem.product.price}</div>
                                            </button>
                                        ))}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className={`font-playfairDisplay w-full pt-[20px] border-t-[2px] ${orderItems.length !== 0 ? '970px:border-[#E2E2E2] border-white' : '970px:border-white/90 border-[#CECECE]'}  flex-col justify-center flex flex z-1`}>
                <div className="flex flex-row w-full justify-between items-center 970px:mt-[10px] text-black">
                    <div className={`font-roboto 1700px:text-[20px] text-[16px] ${orderItems.length === 0 ? '970px:text-white/90 text-[#CECECE]' : 'text-black'}`}>Total</div>
                    <div className={`font-roboto 1700px:text-[20px] text-[16px] ${orderItems.length === 0 ? '970px:text-white/90 text-[#CECECE]' : 'text-black'}`}> ${orderItems.reduce((sum: number, item) => sum + item.product.price * item.quantity, 0)}</div>
                </div>
            </div>

        </div>
    )
}