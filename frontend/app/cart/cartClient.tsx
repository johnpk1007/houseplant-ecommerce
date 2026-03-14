'use client'

import { useState } from "react"
import CartItemImage from "@/components/cart/cartItemImage"
import SmallScreenCartItemImage from "@/components/cart/smallScreenCartItemImage"
import CartItemList from "@/components/cart/cartItemList"
import Address from "@/components/cart/address"
import PaymentRequest from "@/components/cart/paymentRequest"
import { AddressState } from "@/types/addressState"
import Empty_cart from "@/public/images/Empty_cart.webp"
import Image from "next/image"
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { CartItem } from "@/types/cartItem"

export default function CartClient({ initialCart }: { initialCart: CartItem[] | null }) {
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
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const cartItems =
        cartItemsArray !== undefined
            ? cartItemsArray
            : initialCart
    const imageAppear = Boolean(cartItems && cartItems.length === 0)

    return (
        <div className="w-full 1700px:h-[800px] h-[700px] flex flex-row justify-center items-start relative">
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
                    <CartItemImage page={page} cartItems={cartItems} />
                    <SmallScreenCartItemImage page={page} url={url} setUrl={setUrl} cartItems={cartItems} />
                    <CartItemList page={page} setPage={setPage} setUrl={setUrl} stage={stage} setStage={setStage} cartItems={cartItems} />
                    <Address stage={stage} setStage={setStage} address={address} setAddress={setAddress} />
                    <PaymentRequest stage={stage} setStage={setStage} address={address} setAddress={setAddress} cartItems={cartItems} />
                </div>
            </div>
            <Image src={Empty_cart} alt="Empty_cart" className={`absolute top-0 left-0 h-full 970px:w-1/2 w-full object-cover -z-1 ${imageAppear ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out`} />
            <div className={`absolute 970px:top-[50%] 500px:top-[40%] 970px:left-[50%] 500px:left-[20%] 970px:-translate-1/2 500px:-translate-0 font-vogue 970px:text-[120px] 500px:text-[80px]  970px:text-[#ECECEC] text-white/90 970px:text-nowrap -z-1 ${imageAppear ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 ease-in-out leading-none ${stage === 0 ? 'block' : 'hidden'}`}>CART IS EMPTY</div>
        </div >
    )
}