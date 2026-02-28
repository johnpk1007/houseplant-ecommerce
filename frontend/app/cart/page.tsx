'use client'

import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useState } from "react"
import CartItemImage from "@/components/cart/cartItemImage"
import SmallScreenCartItemCheck from "@/components/cart/smallScreenCartItemImage"
import CartItemList from "@/components/cart/cartItemList"
import Address from "@/components/cart/address"

export default function CartItemCheck() {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const [page, setPage] = useState(0)
    const [url, setUrl] = useState<string | null>(null)
    const [stage, setStage] = useState(0)

    return (
        <div className="w-full 1700px:h-[950px] h-[700px] flex flex-row justify-center items-start">
            <div className="w-full h-[97%] pt-[3%] relative overflow-hidden">
                <div className=" w-full h-full flex flex-row justify-start items-start transition duration-500 ease-in-out"
                    style={{
                        transform: `translateX(calc(-${stage} * var(--move-step)))`
                    } as React.CSSProperties}
                >
                    <style jsx>{`
                        div {
                            --move-step: 100%; 
                        }
                        @media (min-width: 970px) {
                            div {
                                --move-step: 50%; 
                            }
                        }
                    `}</style>
                    <CartItemImage cartItemsArray={cartItemsArray} page={page} />
                    <SmallScreenCartItemCheck cartItemsArray={cartItemsArray} page={page} url={url} setUrl={setUrl} />
                    <CartItemList cartItemsArray={cartItemsArray} page={page} setPage={setPage} setUrl={setUrl} stage={stage} setStage={setStage} />
                    <Address />
                </div>
            </div>
        </div >
    )
}