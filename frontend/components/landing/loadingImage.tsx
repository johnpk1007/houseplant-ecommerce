'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function LoadingImage({ id, url, name }: { id: number, url: string, name: string }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const ratios = ["aspect-square", "aspect-[4/5]", "aspect-[2/3]", "aspect-[5/6]"];
    const myRatio = ratios[id % 4];
    return <div className="break-inside-avoid relative">
        <Link href={`/product/${id}`}>
            {!isLoaded && <div className={`bg-gray-200 w-full animate-pulse ${myRatio}`}></div>}
            <Image src={url} alt="product" width={0} height={0} className={`w-full object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
            <div className="absolute left-3 top-3 font-bebasNeue text-[#ADADAD] 750px:text-[25px] text-[20px]">{name}</div>
        </Link>
    </div>
}