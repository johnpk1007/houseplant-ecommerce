'use client'

import { useRef, useState } from "react";
import { createCartItem } from "@/services/cart";
import { useRouter } from "next/navigation";
import Cart from "@/public/icons/cart.svg"
import { Product } from "@/types/product";
import { useCartItemStore } from "@/services/stores/cartItemStore";
import { errorToast } from "@/services/toast/toast";

export default function CartButton({ product, cartQuantity }: { product: Pick<Product, 'id' | 'stock'>, cartQuantity: number }) {
    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const router = useRouter()
    const upsertCartItem = useCartItemStore((state) => state.upsertCartItem)

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
        try {
            const cartItem = await createCartItem({ productId: product.id, quantity: cartQuantity })
            upsertCartItem(cartItem)
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'REFRESH TOKEN EXPIRED') {
                    router.push('/auth/signin')
                }
                if (error.message === 'NOT ENOUGH STOCK') {
                    errorToast(`Only ${product.stock} items available.`)
                }
                if (error.message === 'NO ACCESS TOKEN') {
                    errorToast('Sign in required to add items to cart.')
                }
            }
        }
    };
    return (
        <button onClick={handleClick} className="relative border-solid border-black border-2 rounded-full flex justify-start items-center bg-black text-white hover:bg-black/40 hover:border-black/10 750px:w-[170px] 750px:h-[40px] w-[125px] h-[30px] mb-[14px] duration-300 ease-in-out cursor-pointer text-inherit overflow-hidden">
            <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px] flex-shrink-0">
                <Cart />
            </div>
            <div className="font-roboto 750px:text-[16px] text-[12px] font-bold text-nowrap text-inherit">ADD TO CART</div>
            <span ref={spanRef} className="w-[20px] h-[20px]" style={{ left, top }}></span>
        </button>
    )
}