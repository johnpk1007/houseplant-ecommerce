'use client'

import Light from "@/public/icons/light.svg"
import Water from "@/public/icons/water.svg"
import Temperature from "@/public/icons/temperature.svg"
import Cart from "@/public/icons/cart.svg"
import Buy from "@/public/icons/buy.svg"
import LoadingImage from "@/components/product/loadingImage";
import CartButton from "@/components/product/cartButton";
import Left from "@/public/icons/left.svg"
import Right from "@/public/icons/right.svg"
import { useRef } from "react"
import { Product } from "@/types/product"
import QuantityButton from "./quantityButton"
import ButtonFrame from "./buttonFrame"


export default function ProductMobile({ productData }: { productData: Product }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollTo = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const width = scrollRef.current.clientWidth;
        scrollRef.current.scrollTo({
            left: direction === 'right' ? width : 0,
            behavior: 'smooth'
        });
    }
    return (
        <div className="w-screen h-screen 500px:hidden relative">
            <LoadingImage url={productData.url} />
            <div className="w-full h-full absolute top-0 left-0">
                <div ref={scrollRef} className={`w-full h-full flex flex-row justify-start snap-x snap-mandatory overflow-x-auto`}>
                    <div className="w-screen h-full flex-shrink-0 flex flex-col justify-between p-[30px] relative snap-start">
                        <button type="button" onClick={() => scrollTo('right')} className="w-[18px] h-[18px] shrink-0 text-gray-300 animate-pulse absolute top-[50%] right-[30px] flex justify-center items-center">
                            <Right />
                        </button>
                        <div className="font-playfairDisplay text-[32px]">{productData.name}</div>
                        <ButtonFrame productData={productData} />
                        <div className="text-[24px] font-roboto text font-bold z-2 absolute right-5 bottom-5">${productData.price}</div>
                    </div>
                    <div className="w-screen h-full flex-shrink-0 flex flex-col justify-end items-start p-[30px] bg-black/20 relative snap-start">
                        <button type="button" onClick={() => scrollTo('left')} className="w-[18px] h-[18px] shrink-0 text-white animate-pulse absolute top-[50%] left-[30px] flex justify-center items-center">
                            <Left />
                        </button>
                        <div className="font-playfairDisplay 750px:text-[16px] 500px:text-[11px] text-white mb-[25px] text-balance">{productData.description}</div>
                        <div className="flex items-center mb-[15px] text-white">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0 flex justify-center items-center">
                                <Light />
                            </div>
                            <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-balance">
                                {productData.light}
                            </div>
                        </div>
                        <div className="flex items-center mb-[15px] text-white">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0 flex justify-center items-center">
                                <Water />
                            </div>
                            <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-balance">
                                {productData.water}
                            </div>
                        </div>
                        <div className="flex items-center text-white">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0 flex justify-center items-center">
                                <Temperature />
                            </div>
                            <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-balance">
                                {productData.temperature}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}