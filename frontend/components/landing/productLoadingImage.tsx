'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function ProductLoadingImage({ id, url, name, height, width }: { id: number, url: string, name: string, height: number, width: number }) {
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <div className="break-inside-avoid" style={{ aspectRatio: `${width} / ${height}` }}>
            <Link href={`/product/${id}`} className="w-full h-full relative block">
                {!isLoaded && <div className="bg-gray-200 w-full h-full animate-pulse" ></div>}
                <Image src={url} alt="product" fill className={`object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
                <div className="absolute left-3 top-3 font-bebasNeue text-[#ADADAD] 750px:text-[25px] text-[20px]">{name}</div>
            </Link>
        </div>
    )
}