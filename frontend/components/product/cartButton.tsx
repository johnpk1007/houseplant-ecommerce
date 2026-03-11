'use client'

import { useRef, useState } from "react";
import { createCartItem } from "@/services/clientSide/cart";
import { useRouter } from "next/navigation";
import Cart from "@/public/icons/cart.svg"
import { Product } from "@/types/product";
import { useCartItemStore } from "@/services/stores/cartItemStore";
import { errorToast, successToast } from "@/services/toast/toast";

export default function CartButton({ product, cartQuantity }: { product: Pick<Product, 'id' | 'stock'>, cartQuantity: number }) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const router = useRouter()
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const upsertCartItem = useCartItemStore((state) => state.upsertCartItem)
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
        if (cartItemsArray === null || cartItemsArray === undefined) {
            errorToast('Sign in required to add items to cart.')
            return
        }
        try {
            setIsLoading(true)
            const cartItem = await createCartItem({ productId: product.id, quantity: cartQuantity })
            upsertCartItem(cartItem)
            setIsLoading(false)
            successToast('The item has been added to your cart.')
        } catch (error) {
            setIsLoading(false)
            if (error instanceof Error) {
                if (error.message === 'REFRESH TOKEN EXPIRED') {
                    router.push('/auth/signin')
                }
                if (error.message === 'NOT ENOUGH STOCK') {
                    errorToast(`Only ${product.stock} items available.`)
                }
            }
        }
    };
    return (
        <button onClick={handleClick} className="relative rounded-full bg-black text-white hover:bg-black/40 750px:w-[170px] 750px:h-[40px] w-[125px] h-[30px] duration-300 ease-in-out cursor-pointer overflow-hidden">
            {isLoading ?
                <div className="h-full w-full flex flex-row justify-center">
                    <div className="h-full w-[40%] flex flex-row justify-around items-center">
                        <span className="h-[10px] w-[10px] rounded-full animate-pulse [animation-duration:900ms] bg-white" />
                        <span className="h-[10px] w-[10px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:300ms] bg-white" />
                        <span className="h-[10px] w-[10px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:600ms] bg-white" />
                    </div>
                </div>
                :
                <div className="h-full w-full flex justify-start items-center ">
                    <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px] flex-shrink-0">
                        <Cart />
                    </div>
                    <div className="font-roboto 750px:text-[16px] text-[12px] font-bold text-nowrap text-inherit">ADD TO CART</div>
                </div>
            }
            <span ref={spanRef} className="w-[20px] h-[20px]" style={{ left, top }}></span>
        </button>
    )
}