'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function LoadingImage({ url }: { url: string }) {
    const [isLoaded, setIsLoaded] = useState(false)
    return <div className="relative">
        {!isLoaded && <div className="bg-gray-200 w-full h-full animate-pulse"></div>}
        <Image src={url} alt="product" width={0} height={0} className={`w-full object-cover ${isLoaded ? "opacity-100" : "opacity-0"}`} onLoad={() => setIsLoaded(true)} />
    </div>
}