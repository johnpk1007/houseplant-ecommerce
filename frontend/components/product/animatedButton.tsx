'use client'

import { useRef, useState } from "react";

export default function AnimatedButton({ image, text, type }: { image: any, text: string, type: "cart" | "buy" }) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
    };
    return (
        <button onClick={handleClick} className={`relative border-solid border-black border-2 rounded-full flex justify-start items-center ${type === "cart" ? "hover:bg-black/10 hover:border-black/10 hover:text-white" : "bg-black text-white hover:bg-black/40 hover:border-black/10"} 750px:w-[170px] 750px:h-[40px] w-[110px] h-[25px] mb-[14px] duration-300 ease-in-out cursor-pointer text-inherit overflow-hidden`}>
            <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px] flex-shrink-0">
                {image}
            </div>
            <div className="font-roboto 750px:text-[16px] text-[10px] font-bold text-nowrap text-inherit ripple">{text}</div>
            <span ref={spanRef} className="w-[20px] h-[20px]" style={{ left, top }}></span>
        </button>
    )
}