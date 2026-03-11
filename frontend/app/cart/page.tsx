'use client'

import { useState } from "react"
import CartItemImage from "@/components/cart/cartItemImage"
import SmallScreenCartItemImage from "@/components/cart/smallScreenCartItemImage"
import CartItemList from "@/components/cart/cartItemList"
import Address from "@/components/cart/address"
import PaymentRequest from "@/components/cart/paymentRequest"
import { AddressState } from "@/types/addressState"

export default function Cart() {
    const [page, setPage] = useState(0)
    const [url, setUrl] = useState<string | null>(null)
    const [stage, setStage] = useState(0)
    const [address, setAddress] = useState<AddressState>({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        streetAddress: "",
        extendedAddress: "",
        locality: "",
        administrativeAreaLevel1: "",
        postalCode: ""
    });

    return (
        <div className="w-full 1700px:h-[800px] h-[700px] flex flex-row justify-center items-start">
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
                    <CartItemImage page={page} />
                    <SmallScreenCartItemImage page={page} url={url} setUrl={setUrl} />
                    <CartItemList page={page} setPage={setPage} setUrl={setUrl} stage={stage} setStage={setStage} />
                    <Address stage={stage} setStage={setStage} address={address} setAddress={setAddress} />
                    <PaymentRequest stage={stage} setStage={setStage} address={address} setAddress={setAddress} />
                </div>
            </div>
        </div >
    )
}