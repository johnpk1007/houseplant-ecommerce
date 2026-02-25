'use client'

import Login from "@/public/icons/login.svg"
import Logout from "@/public/icons/logout.svg"
import Cart from "@/public/icons/cart.svg"
import FullCart from "@/public/icons/fullcart.svg"
import { useRouter } from 'next/navigation';
import { useAccessTokenStore } from "@/services/stores/accessTokenStore";
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { signOut } from "@/services/auth";
import { CartItem } from "@/types/cartItem"

export default function Header(
    { initialAccessToken, initialCartItemsArray }: { initialAccessToken: string | null, initialCartItemsArray: CartItem[] | null }
) {
    const accessToken = useAccessTokenStore((state => state.accessToken))
    const setAccessToken = useAccessTokenStore((state) => state.setAccessToken)
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    const router = useRouter()
    const loggedIn =
        accessToken !== undefined
            ? !!accessToken
            : !!initialAccessToken
    const cartItems =
        cartItemsArray !== undefined
            ? cartItemsArray
            : initialCartItemsArray

    return (
        <header className="fixed top-0 right-0 w-[50px] z-3 flex flex-row justify-center">
            {
                loggedIn
                    ?
                    <div className="w-full flex flex-col items-center justify-start">
                        <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[10px] mb-[10px]" onClick={async () => {
                            setAccessToken(null)
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
                    <button type="button" className="h-[30px] w-[30px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer mt-[10px]" onClick={() => router.push('/signin')}>
                        <Login />
                    </button>
            }

        </header>
    )
}