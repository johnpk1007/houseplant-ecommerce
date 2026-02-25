'use client'

import Plus from "@/public/icons/plus.svg"
import { editCartItem } from "@/services/cart"
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useState } from "react"
import { errorToast } from "@/services/toast/toast";
import { CartItem } from "@/types/cartItem"

export default function PlusButton({ cartItemId, quantity }: { cartItemId: number, quantity: number }) {
    const upsertCartItem = useCartItemStore((state) => state.upsertCartItem)
    const [isLoading, setIsLoading] = useState(false)
    const handlePlus = async ({ cartItemId, quantity }: { cartItemId: number, quantity: number }) => {
        try {
            setIsLoading(true)
            const cartItem: CartItem = await editCartItem({ cartItemId, quantity })
            upsertCartItem(cartItem)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            if (error instanceof Error) {
                if (error.message === 'NOT ENOUGH STOCK') {
                    errorToast(`Only ${quantity - 1} items available.`)
                }
            }

        }

    }

    return (
        <button
            type="button"
            onClick={() => {
                if (!isLoading) {
                    handlePlus({ cartItemId, quantity })
                }
            }}
            className={`border-1 border-[#ADADAD] rounded-full h-[12px] w-[11px] text-[8px] text-[#ADADAD] flex justify-center items-center mr-[5px] duration-300 ease-in-out hover:text-white hover:bg-gray-200 hover:border-gray-200 cursor-pointer ${isLoading && 'animate-pulse bg-gray-200 border-gray-200 text-white cursor-default'}`}>
            <Plus />
        </button>)
}