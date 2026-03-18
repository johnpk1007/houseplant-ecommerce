'use client'

import Image, { StaticImageData } from "next/image"
import { useState } from "react"

export default function LoadingImageWithImageData({ imageData, fetchpriority }: { imageData: StaticImageData, fetchpriority?: "high" }) {
    const [isLoaded, setIsLoaded] = useState(false)
    return (
        <div
            className={`-z-1 relative w-full h-full`}
        >
            {!fetchpriority && !isLoaded && <div className="bg-gray-200 w-full h-full animate-pulse"></div>}
            <Image
                src={imageData}
                alt="product"
                fill
                className={`object-cover 
                    ${fetchpriority === "high"
                        ? ""
                        : isLoaded
                            ? "opacity-100"
                            : "opacity-0"
                    } 
                    transition-opacity duration-300 ease-in-out`}
                onLoad={() => setIsLoaded(true)}
                priority={fetchpriority === "high"}
                {...(fetchpriority ? { fetchPriority: fetchpriority } : {})}
            />
        </div>)
}