'use client'

import Image, { StaticImageData } from "next/image"
import { useState } from "react"

export default function LoadingImageWithImageData({ imageData, fetchpriority }: { imageData: StaticImageData, fetchpriority?: "high" }) {
    const [isLoaded, setIsLoaded] = useState(false)
    const isLCP = fetchpriority === "high";
    return (
        <div
            className={`-z-1 relative w-full h-full`}
        >
            {!fetchpriority && !isLoaded && <div className="bg-gray-200 w-full h-full animate-pulse"></div>}
            <Image
                src={imageData}
                alt="product"
                fill
                priority={isLCP}
                fetchPriority={fetchpriority}
                className={`object-cover 
                    ${isLCP
                        ? ""
                        : isLoaded
                            ? "opacity-100"
                            : "opacity-0"
                    } 
                    ${isLCP ?
                        ""
                        :
                        "transition-opacity duration-300 ease-in-out"}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>)
}