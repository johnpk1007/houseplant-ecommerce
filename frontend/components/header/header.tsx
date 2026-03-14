'use client'

import Home from "@/public/icons/home.svg"
import Login from "@/public/icons/login.svg"
import Logout from "@/public/icons/logout.svg"
import Cart from "@/public/icons/cart.svg"
import FullCart from "@/public/icons/fullcart.svg"
import Buy from "@/public/icons/buy.svg"
import { useRouter } from 'next/navigation';
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { signOut } from "@/services/clientSide/auth";
import { CartItem } from "@/types/cartItem"
import { usePathname } from "next/navigation"


export default function Header(
    { initialCart }: { initialCart: CartItem[] | null }
) {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    const router = useRouter()
    const cartItems =
        cartItemsArray !== undefined
            ? cartItemsArray
            : initialCart

    const pathName = usePathname()

    return (
        <header className="fixed top-0 right-0 w-[50px] z-3 flex flex-row justify-center">
            {
                cartItems !== null
                    ?
                    <div className="w-full flex flex-col items-center justify-start">
                        {pathName !== '/' && <button type="button" className="h-[25px] w-[25px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[15px]" onClick={() => router.push('/')}>
                            <Home />
                        </button>}
                        {pathName !== '/cart' && <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer relative mt-[15px]" onClick={() => router.push('/cart')}>
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
                        </button>}
                        {pathName !== '/order' && <button type="button" className="h-[35px] w-[35px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[15px]" onClick={() => router.push('/order')}>
                            <Buy />
                        </button>}
                        <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[15px]" onClick={async () => {
                            setCartItemsArray(null)
                            await signOut()
                        }}>
                            <Logout />
                        </button>
                    </div>
                    :
                    <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[15px]" onClick={() => router.push(`/auth/?returnUrl=${encodeURIComponent(pathName)}`)}>
                        <Login />
                    </button>
            }

        </header>
    )
}