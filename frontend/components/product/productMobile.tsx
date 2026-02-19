'use client'

import Light from "@/public/icons/light.svg"
import Water from "@/public/icons/water.svg"
import Temperature from "@/public/icons/temperature.svg"
import Cart from "@/public/icons/cart.svg"
import Buy from "@/public/icons/buy.svg"
import LoadingImage from "@/components/product/loadingImage";
import AnimatedButton from "@/components/product/animatedButton";
import Left from "@/public/icons/left.svg"
import Right from "@/public/icons/right.svg"
import { useState } from "react"


export default function ProductMobile({ productData }: { productData: any }) {
    const [isLeft, setIsLeft] = useState(true)
    return (
        <div className="w-screen h-screen 500px:hidden overflow-hidden relative">
            <LoadingImage url={productData.url} />
            <div className="w-full h-full absolute top-0 left-0">
                <div className={`w-full h-full flex flex-row justify-start transition duration-300 ease-in-out ${!isLeft && '-translate-x-[100%]'}`}>
                    <div className="w-screen h-full flex-shrink-0 flex flex-col justify-between p-[30px] relative">
                        <button type="button" onClick={() => { setIsLeft(false) }} className="w-[18px] h-[18px] shrink-0 text-gray-300 animate-pulse absolute top-[50%] right-[30px]">
                            <Right />
                        </button>
                        <div className="font-playfairDisplay text-[32px]">{productData.name}</div>
                        <div className="flex flex-row justify-between">
                            <div className="flex flex-col z-2">
                                <AnimatedButton image={<Cart />} text="ADD TO CART" type="cart" />
                                <AnimatedButton image={<Buy />} text="BUY NOW" type="buy" />
                            </div>
                            <div className="text-[24px] font-roboto text font-bold z-2 self-end">${productData.price}</div>
                        </div>
                    </div>
                    <div className="w-screen h-full flex-shrink-0 flex flex-col justify-end items-start p-[30px] bg-black/20 relative">
                        <button type="button" onClick={() => { setIsLeft(true) }} className="w-[18px] h-[18px] shrink-0 text-white animate-pulse absolute top-[50%] left-[30px]">
                            <Left />
                        </button>
                        <div className="font-playfairDisplay 750px:text-[16px] 500px:text-[11px] text-white mb-[25px] text-balance">{productData.description}</div>
                        <div className="flex items-center mb-[15px] text-white">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0">
                                <Light />
                            </div>
                            <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-balance">
                                {productData.light}
                            </div>
                        </div>
                        <div className="flex items-center mb-[15px] text-white">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0">
                                <Water />
                            </div>
                            <div className="font-roboto 750px:text-[16px] 500px:text-[11px] text-balance">
                                {productData.water}
                            </div>
                        </div>
                        <div className="flex items-center text-white">
                            <div className="w-[19px] h-[19px] mr-[8px] shrink-0">
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