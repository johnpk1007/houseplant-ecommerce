'use client'

import Login from "@/public/icons/login.svg"
import Logout from "@/public/icons/logout.svg"
import Cart from "@/public/icons/cart.svg"
import { useRouter } from 'next/navigation';
import { useContext } from "react"
import { Context } from "@/components/context/context"
import { signOut } from "@/services/auth";

export default function Header() {
    const { accessToken, setAccessToken } = useContext(Context)
    const router = useRouter()
    return (
        <header className="fixed top-0 right-0 w-[40px] h-[110px] flex flex-col items-center justify-around z-3">
            {accessToken ?
                <button type="button" className="h-[22px] w-[22px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer" onClick={async () => {
                    setAccessToken(null)
                    await signOut()
                }}>
                    <Logout />
                </button>
                :
                <button type="button" className="h-[22px] w-[22px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer" onClick={() => router.push('/signin')}>
                    <Login />
                </button>
            }
            <button type="button" className="h-[26px] w-[26px] duration-300 ease-in-out text-gray-300 hover:text-gray-400 cursor-pointer">
                <Cart />
            </button>
        </header>
    )
}