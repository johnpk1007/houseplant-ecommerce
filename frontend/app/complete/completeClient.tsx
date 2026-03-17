'use client'

import { useEffect, useState } from "react";
import Complete from '@/public/images/Complete.webp'
import Unclompete from "@/public/images/Uncompleted.webp"
import Right from "@/public/icons/right.svg"
import Left from "@/public/icons/left.svg"
import { getOrder } from "@/services/clientSide/complete";
import LoadingImageWithImageData from "@/components/common/loadingImageWithImageData";

type OrderItem = {
    name: string
    price: number
    quantity: number
}

type OrderType = {
    status: 'PENDING' | 'PAID' | 'FAILED';
    orderItems: OrderItem[];
}

export default function CompleteClient({ paymentIntentId }: { paymentIntentId: string }) {
    const [page, setPage] = useState(0)
    const [order, setOrder] = useState<OrderType | null>(null);

    useEffect(() => {
        let attempts = 0;
        const maxAttempts = 5;

        const checkOrder = async () => {
            attempts++;
            const fetchedOrder = await getOrder({ paymentIntentId });
            if (fetchedOrder.status !== 'PENDING' || attempts >= maxAttempts) {
                setOrder(fetchedOrder);
                return true;
            }
            return false;
        }

        const interval = setInterval(async () => {
            const done = await checkOrder();
            if (done) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [paymentIntentId]);

    const orderItemsArray: OrderItem[] = order?.orderItems?.map((item: any) => ({
        name: item.product.name,
        price: item.price,
        quantity: item.quantity
    })) ?? [];

    const itemsPerPage = 4
    const maxPage: number = Math.ceil(orderItemsArray.length / itemsPerPage) - 1

    const handleNext = () => {
        if (page < maxPage) {
            setPage(p => p + 1)
        }
    }
    const handlePrev = () => {
        if (page > 0) {
            setPage(p => p - 1)
        }
    }

    return (<div className="w-full flex flex-row justify-center">
        {!!order ?
            <div className="flex flex-col 1700px:h-[1000px] 500px:h-[700px] h-screen w-full">
                <div className="w-full flex-1 500px:block hidden" />
                <div className="w-full 500px:h-[30%] h-full relative">
                    <LoadingImageWithImageData imageData={order.status === 'PAID' ? Complete : Unclompete} />
                    <div className="absolute top-0 left-0 flex flex-col w-full pt-[20px] pl-[40px]">
                        <div className={`970px:top-[15px] 500px:top-[8px] top-[50px] left-[40px] z-3 ${maxPage === 0 && 'hidden'}`}>
                            <button className={`text-[#ADADAD] w-[20px] h-[20px] duration-300 ease-in-out ${page === 0 ? 'text-[#ADADAD]' : 'text-[#E2E2E2] hover:text-[#E2E2E2]/70 cursor-pointer'}`} onClick={handlePrev}><Left /></button>
                            <button className={`text-[#ADADAD] w-[20px] h-[20px] duration-300 ease-in-out ${page === maxPage ? 'text-[#ADADAD]' : 'text-[#E2E2E2] hover:text-[#E2E2E2]/70 cursor-pointer'} ml-[10px]`} onClick={handleNext}><Right /></button>
                        </div>
                        <div className="970px:top-[20px] 500px:top-[35px] top-[100px] 970px:left-[40px] left-[5%] 1300px:w-[25%] 970px:w-[33%] 970px:aspect-9/7 500px:w-[400px] w-[90%] 970px:aspect-5/3 500px:aspect-7/3 aspect-3/2 overflow-hidden z-2">
                            <div className="w-full h-full flex flex-col transition-transform duration-300"
                                style={{
                                    transform: `translateY(-${page * 100}%)`
                                }}>
                                {
                                    !!orderItemsArray &&
                                    Array.from({ length: Math.ceil(orderItemsArray.length / 4) }).map((_, pageIndex) => (
                                        <div key={pageIndex} className="flex flex-col w-full h-full flex-shrink-0">
                                            {orderItemsArray
                                                .slice(pageIndex * 4, pageIndex * 4 + 4)
                                                .map((orderItem, index) => (
                                                    <div key={index} className={`w-full h-1/4 flex flex-row justify-between items-center ${index < 2 ? 'text-white/80 ' : index === 2 ? '1700px:text-white 1400px:text-[#ADADAD] 1300px:text-white/80 1100px:text-[#ADADAD] 970px:text-white/80 text-white/80' : '970px:text-[#ADADAD] text-white/80'}`}>
                                                        <div className="flex flex-row items-center">
                                                            <div className="font-roboto font-light 1300px:text-[16px] text-[14px] mr-[10px]">{orderItem.quantity}</div>
                                                            <div className="font-roboto font-light 1300px:text-[16px] text-[14px] mr-[10px]">{orderItem.name}</div>
                                                        </div>
                                                        <div className="font-roboto font-light 1300px:text-[16px] text-[14px]">${orderItem.price}</div>
                                                    </div>
                                                ))}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        <div className="font-playfairDisplay h-[110px] 1300px:w-[25%] 970px:w-[33%] 500px:w-[400px] w-[90%] border-t-[2px] 500px:border-[#E2E2E2] border-white/80 flex-col justify-center 970px:flex 500px:hidden flex z-1">
                            <div className="flex flex-row w-full justify-between items-center mt-[10px] 500px:text-[#ADADAD] text-white/80">
                                <div className="font-roboto 1300px:text-[20px] 750px:text-[18px]">Total</div>
                                <div className="font-roboto 1300px:text-[20px] 750px:text-[18px]"> ${orderItemsArray.reduce((sum: number, item) => sum + item.price * item.quantity, 0)}</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-full absolute top-0 left-0 bg-black/40 items-end 500px:hidden flex">
                        <div className="w-full h-3/7 flex flex-col justify-start items-end pt-[30px] px-[20px]">
                            <div className="font-playfairDisplay text-[30px] text-right text-balance w-full text-white/70 mb-[30px]">
                                {order.status === 'PAID' ? 'Your Order is Confirmed and Processing.' : 'Your order was not Completed.'}
                            </div>
                            <div className="font-playfairDisplay text-[14px] text-right text-balance w-full text-white/70">
                                {order.status === 'PAID' ?
                                    'We are so grateful to welcome you to our community. Your new plants are now being prepared by our expert growers and will be shipped with the utmost care. We encourage you to begin preparing your space and gathering inspiration to truly embrace your slow living journey.'
                                    :
                                    'Unfortunately, we were unable to process your order. Please review your payment details or try again. If the issue persists, feel free to contact our support team for assistance.'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full 1700px:flex-1 flex-2 flex flex-row justify-end 500px:block hidden">
                    <div className="flex flex-col justify-start items-end 1700px:pt-[80px] pt-[30px] 1700px:pr-[100px] 750px:pr-[50px] px-[20px]">
                        <div className="font-playfairDisplay 1700px:text-[40px] text-[30px] text-right text-balance w-[500px] 1700x:mb-[60px] mb-[30px]">
                            {order.status === 'PAID' ? 'Your Order is Confirmed and Processing.' : 'Your order was not Completed.'}
                        </div>
                        <div className="font-playfairDisplay 1700px:text-[16px] text-[14px] text-right text-balance 750px:w-[700px] w-full text-[#ADADAD]">
                            {order.status === 'PAID' ?
                                'We are so grateful to welcome you to our community. Your new plants are now being prepared by our expert growers and will be shipped with the utmost care. We encourage you to begin preparing your space and gathering inspiration to truly embrace your slow living journey.'
                                :
                                'Unfortunately, we were unable to process your order. Please review your payment details or try again. If the issue persists, feel free to contact our support team for assistance.'}
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="flex flex-col 1700px:h-[1000px] 500px:h-[700px] h-screen w-full justify-center items-center">
                <div className="h-[20px] w-[350px] flex flex-row justify-around items-center">
                    <span className="h-[20px] w-[20px] rounded-full animate-pulse [animation-duration:900ms] bg-[#ADADAD]/50" />
                    <span className="h-[20px] w-[20px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:300ms] bg-[#ADADAD]/50" />
                    <span className="h-[20px] w-[20px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:600ms] bg-[#ADADAD]/50" />
                    <span className="h-[20px] w-[20px] rounded-full animate-pulse [animation-duration:900ms] bg-[#ADADAD]/50" />
                </div>
            </div>
        }
    </div>
    )
}