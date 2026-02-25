'use client'

import Minus from "@/public/icons/minus.svg"
import Plus from "@/public/icons/plus.svg"
import { editCartItem, deleteCartItem } from "@/services/cart"
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useState } from "react"

export default function MinusButton({ cartItemId, quantity }: { cartItemId: number, quantity: number }) {
    const upsertCartItem = useCartItemStore((state) => state.upsertCartItem)
    const removeCartItem = useCartItemStore((state) => state.removeCartItem)
    const [isLoading, setIsLoading] = useState(false)
    const handleMinus = async ({ cartItemId, quantity }: { cartItemId: number, quantity: number }) => {
        setIsLoading(true)
        const cartItem = await editCartItem({ cartItemId, quantity })
        upsertCartItem(cartItem)
        setIsLoading(false)
    }
    const handleDelete = async ({ }) => {
        setIsLoading(true)
        await deleteCartItem({ cartItemId })
        removeCartItem(cartItemId)
        setIsLoading(false)
    }

    return (
        <button
            type="button"
            onClick={() => {
                if (quantity !== 0) {
                    if (!isLoading) {
                        handleMinus({ cartItemId, quantity })
                    }
                } else {
                    if (!isLoading) {
                        handleDelete({ cartItemId })
                    }
                }
            }}
            className={`border-1 border-[#ADADAD] rounded-full h-[12px] w-[11px] text-[8px] text-[#ADADAD] flex justify-center items-center mr-[5px] duration-300 ease-in-out hover:text-white hover:bg-gray-200 hover:border-gray-200 cursor-pointer ${isLoading && 'animate-pulse bg-gray-200 border-gray-200 text-white cursor-default'} ${quantity === 0 && 'rotate-45'}`}>
            {quantity === 0 ? <Plus /> : <Minus />}
        </button>)
}