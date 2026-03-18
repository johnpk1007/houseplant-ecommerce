'use client'

import Plus from "@/public/icons/plus.svg"
import Minus from "@/public/icons/minus.svg"
import { useRef, useState } from "react";

export default function QuantityButton({ cartQuantity, setCartQuantity }: { cartQuantity: number, setCartQuantity: React.Dispatch<React.SetStateAction<number>> }) {
    const minusRef = useRef<HTMLButtonElement>(null);
    const plusRef = useRef<HTMLButtonElement>(null);
    const [minusLeft, setMinusLeft] = useState(0);
    const [minusTop, setMinusTop] = useState(0);
    const [plusLeft, setPlusLeft] = useState(0);
    const [plusTop, setPlusTop] = useState(0);
    const minusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!minusRef.current) return
        minusRef.current.classList.remove("ripple");
        setMinusLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setMinusTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        minusRef.current.classList.add("ripple");
        setCartQuantity(state => Math.max(state - 1, 1))
    }
    const plusClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!plusRef.current) return
        plusRef.current.classList.remove("ripple");
        setPlusLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setPlusTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        plusRef.current.classList.add("ripple");
        setCartQuantity(state => Math.min(state + 1, 99))
    }
    return (
        <div className="relative box-border border-solid border-black border-2 rounded-full flex justify-between items-center text-black hover:bg-black/10 hover:border-black/10 hover:text-white 750px:w-[170px] 750px:h-[40px] 500px:w-[125px] 500px:h-[30px] w-[170px] h-[40px] mb-[14px] duration-300 ease-in-out text-inherit overflow-hidden">
            <button aria-label="Minus" onClick={minusClick} type="button" className="750px:w-[20px] 750px:h-[20px] 500px:w-[16px] 500px:h-[16px] w-[20px] h-[20px] flex-shrink-0 flex justify-center items-center ml-[10px] cursor-pointer rounded-full relative">
                <Minus className="w-full h-full" />
                <span ref={minusRef} className="w-[20px] h-[20px] absolute" style={{ left: minusLeft, top: minusTop }}></span>
            </button>
            <div className="font-roboto 750px:text-[20px] 500px:text-[12px] text-[20px] font-bold text-nowrap text-inherit">{cartQuantity}</div>
            <button aria-label="Plus" onClick={plusClick} type="button" className="750px:w-[20px] 750px:h-[20px] 500px:w-[16px] 500px:h-[16px] w-[20px] h-[20px] flex-shrink-0 flex justify-center items-center mr-[10px] cursor-pointer rounded-full relative">
                <Plus className="w-full h-full" />
                <span ref={plusRef} className="w-[20px] h-[20px] absolute" style={{ left: plusLeft, top: plusTop }}></span>
            </button>
        </div>
    )
}