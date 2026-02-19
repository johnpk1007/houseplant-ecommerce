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
            {`${accessToken}`}
            {accessToken ?
                <button type="button" className="h-[22px] w-[22px] text-gray-300" onClick={async () => {
                    setAccessToken(null)
                    await signOut()
                }}>
                    <Logout />
                </button>
                :
                <button type="button" className="h-[22px] w-[22px] text-gray-300" onClick={() => router.push('/signin')}>
                    <Login />
                </button>
            }
            <button type="button" className="h-[26px] w-[26px] text-gray-300">
                <Cart />
            </button>
        </header>
    )
}