'use client'

import { useState } from "react"
import SignIn from "@/components/auth/signIn"
import SignUp from "@/components/auth/signUp"

export default function Auth() {
    const [isSignUp, setIsSignUp] = useState(false)
    return (
        <div className="w-full 1700px:h-[956px] 500px:h-[750px] h-screen flex flex-row justify-center">
            <div className="w-[312px] h-[455px] 1700px:mt-[230px] mt-[100px] overflow-hidden">
                <div className={`transition duration-300 ease-in-out ${isSignUp && '-translate-x-[312px]'} flex flex-row`}>
                    <SignIn setIsSignUp={setIsSignUp} />
                    <SignUp setIsSignUp={setIsSignUp} />
                </div>
            </div>
        </div>
    )
}