'use client'

import Login from "@/public/icons/login.svg"
import Google from "@/public/icons/Google__G__logo.svg"
import { useState } from "react"
import signUp from "@/services/auth"

export default function SignIn() {
    const [isSignUp, setIsSignUp] = useState(false)
    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        if (isSignUp) {
            const formData = new FormData(event.currentTarget);
            const email = formData.get("email") as string
            const password = formData.get("password") as string
            const user = await signUp({ email, password })
        }
    }

    return (
        <div className="w-full 1700px:h-[956px] 500px:h-[750px] h-screen flex flex-row justify-center">
            <div className="w-[312px] h-[455px] 1700px:mt-[230px] mt-[100px] overflow-hidden">
                <div className={`transition duration-300 ease-in-out ${isSignUp && '-translate-x-[312px]'} flex flex-row`}>
                    <div className="w-[312px] h-[455px] flex flex-col items-center flex-shrink-0">
                        <div className="font-playfairDisplay text-[40px]">Sign In</div>
                        <button type="button" className="font-playfairDisplay text-[16px] text-[#ADADAD] mb-[50px]" onClick={() => setIsSignUp(true)}>Or create an account</button>
                        <form className="flex flex-col items-center w-full">
                            <input name="email" type="email" className="w-full h-[42px] border border-[#ADADAD] mb-[18px] pl-3" placeholder="Email" />
                            <input name="password" type="password" className="w-full h-[42px] border border-[#ADADAD] mb-[114px] pl-3" placeholder="Password" />
                            <button className="bg-black border-solid border-black border-2 rounded-full flex justify-start items-center w-full h-[40px] mb-[18px]">
                                <div className="h-[22px] w-[22px] text-white ml-[12px] mr-[12px] mb-[5px]">
                                    <Login />
                                </div>
                                <div className="text-white font-roboto text-[16px] font-bold text-nowrap">Sign in</div>
                            </button>
                            <button type="button" className="border-solid border-[#ADADAD] border-2 rounded-full flex justify-start items-center w-full h-[40px]">
                                <div className="h-[22px] w-[22px] text-white ml-[12px] mr-[12px] mb-[5px]">
                                    <Google />
                                </div>
                                <div className="text-[#ADADAD] font-roboto text-[16px] font-bold text-nowrap">Sign in with Google</div>
                            </button>
                        </form>
                    </div>
                    <div className="w-[312px] h-[455px] flex flex-col items-center flex-shrink-0">
                        <div className="font-playfairDisplay text-[40px]">Sign Up</div>
                        <button type="button" className="font-playfairDisplay text-[16px] text-[#ADADAD] mb-[50px]" onClick={() => setIsSignUp(false)}>Or sign in with your account</button>
                        <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
                            <input name="email" type="email" className="w-full h-[42px] border border-[#ADADAD] mb-[18px] pl-3" placeholder="Email" />
                            <input name="password" type="password" className="w-full h-[42px] border border-[#ADADAD] mb-[114px] pl-3" placeholder="Password" />
                            <button type="submit" className="bg-black border-solid border-black border-2 rounded-full flex justify-start items-center w-full h-[40px] mb-[18px]">
                                <div className="h-[22px] w-[22px] text-white ml-[12px] mr-[12px] mb-[5px]">
                                    <Login />
                                </div>
                                <div className="text-white font-roboto text-[16px] font-bold text-nowrap">Sign up</div>
                            </button>
                            <button type="button" className="border-solid border-[#ADADAD] border-2 rounded-full flex justify-start items-center w-full h-[40px]">
                                <div className="h-[22px] w-[22px] text-white ml-[12px] mr-[12px] mb-[5px]">
                                    <Google />
                                </div>
                                <div className="text-[#ADADAD] font-roboto text-[16px] font-bold text-nowrap">Sign up with Google</div>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}