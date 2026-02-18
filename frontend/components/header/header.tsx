import Login from "@/public/icons/login.svg"
import Cart from "@/public/icons/cart.svg"

export default function Header() {
    return (
        <header className="fixed top-0 right-0 w-[40px] h-[110px] flex flex-col items-center justify-around z-3">
            <div className="h-[22px] w-[22px] text-gray-300">
                <Login />
            </div>
            <div className="h-[26px] w-[26px] text-gray-300">
                <Cart />
            </div>
        </header>
    )
}