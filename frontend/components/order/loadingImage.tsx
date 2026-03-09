'use client'

import Image from "next/image"
import { useState } from "react"

export default function LoadingImage({ url }: { url: string }) {
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <div className="h-full w-full relative">
            {!isLoaded && <div className="500px:bg-gray-100 bg-gray-200 w-full h-full animate-pulse"></div>}
            <Image src={url} alt="Product" width={0} height={0} className={`w-full h-full object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
        </div>)
}