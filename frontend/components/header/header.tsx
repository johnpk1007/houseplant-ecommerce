'use client'

import Login from "@/public/icons/login.svg"
import Logout from "@/public/icons/logout.svg"
import Cart from "@/public/icons/cart.svg"
import FullCart from "@/public/icons/fullcart.svg"
import { useRouter } from 'next/navigation';
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { signOut } from "@/services/clientSide/auth";
import { CartItem } from "@/types/cartItem"
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies"

export default function Header(
    { initialCartItemsArray }: { initialCartItemsArray: CartItem[] | null }
) {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    const router = useRouter()
    const cartItems =
        cartItemsArray !== undefined
            ? cartItemsArray
            : initialCartItemsArray
    return (
        <header className="fixed top-0 right-0 w-[50px] z-3 flex flex-row justify-center">
            {
                cartItems !== null
                    ?
                    <div className="w-full flex flex-col items-center justify-start">
                        <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[10px] mb-[10px]" onClick={async () => {
                            setCartItemsArray(null)
                            await signOut()
                        }}>
                            <Logout />
                        </button>
                        <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer relative" onClick={() => router.push('/cart')}>
                            {cartItems !== null ? <FullCart /> : <Cart />}
                            {cartItems !== null && <span className="absolute -top-[7px] -right-[8px]">
                                <span className="relative flex justify-center items-center h-[20px] w-[20px] ">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current text-inherent opacity-75"></span>
                                    <span className="relative inline-flex h-[20px] w-[20px] rounded-full bg-current text-inherent flex justify-center items-center">
                                        <span className="text-white text-[14px]">
                                            {cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}
                                        </span>
                                    </span>
                                </span>
                            </span>}
                        </button>
                    </div>
                    :
                    <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[10px]" onClick={() => router.push('/auth')}>
                        <Login />
                    </button>
            }

        </header>
    )
}