'use client'

import Image from "next/image"
import { useState } from "react"

export default function LoadingImageWithURL({ url }: { url: string }) {
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <div className="h-full w-full relative">
            {!isLoaded && <div className="500px:bg-gray-100 bg-gray-200 w-full h-full animate-pulse"></div>}
            <Image src={url} alt="Product" fill className={`object-cover ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300 ease-in-out`} onLoad={() => setIsLoaded(true)} />
        </div>)
}