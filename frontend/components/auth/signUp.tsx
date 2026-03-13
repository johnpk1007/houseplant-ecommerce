import Login from "@/public/icons/login.svg"
import Google from "@/public/icons/Google__G__logo.svg"
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { localSignUp } from "@/services/clientSide/auth"
import { useCartItemStore } from "@/services/stores/cartItemStore"
import { useSignedInStore } from "@/services/stores/signedInStore"
import { getAllCartItem } from "@/services/clientSide/cart"
import { useRouter, useSearchParams } from 'next/navigation'
import AuthInput from "./authInput";
import { errorToast } from "@/services/toast/toast";

export default function SignUp({ setIsSignUp }: { setIsSignUp: Dispatch<SetStateAction<boolean>> }) {
    const [signUpField, setSignUpField] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [touched, setTouched] = useState({ email: false, password: false, confirmPassword: false });
    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);
    const searchParams = useSearchParams()
    const returnUrl = searchParams.get('returnUrl') || '/'

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "email":
                if (!value.trim()) return "Please enter your email.";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter your full email address.";
                return "";

            case "password":
                if (value.length < 6) return "Please enter a password with at least 6 characters.";
                if (value !== signUpField.confirmPassword && touched.confirmPassword) return "Please make sure the passwords match."
                return "";

            case "confirmPassword":
                if (value.length < 6) return "Please enter a password with at least 6 characters.";
                if (value !== signUpField.password) return "Please make sure the passwords match."
                return "";

            default:
                return "";
        }
    };



    const setCartItemsArray = useCartItemStore((state) => state.setCartItemsArray)
    const setSigneIn = useSignedInStore((state) => state.setIsSignedIn)
    const router = useRouter()

    const emptyFields = Object.entries(signUpField)
        .filter(([_, value]) => value === "")
        .map(([key]) => key as keyof typeof signUpField);

    const allConfirmed = Object.values(error).every(value => value === "");

    const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (emptyFields.length !== 0) {
            emptyFields.map((item) => {
                setTouched((prev) => ({ ...prev, [item]: true }))
                const errorMessage = validateField(item, signUpField[item]);
                setError((prev) => ({ ...prev, [item]: errorMessage }))
            })
            return
        }
        if (!allConfirmed) {
            return
        }
        setIsRequestLoading(true);
        try {
            await localSignUp({ email: signUpField.email, password: signUpField.password })
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === 'EMAIL ALREADY EXITS') {
                    errorToast(`This email is already registered.\n Please sign in instead.`)
                }
            }
            setIsRequestLoading(false);
            return
        }
        const cartItems = await getAllCartItem()
        setCartItemsArray(cartItems)
        setSigneIn(true)
        setIsRequestLoading(false);
        router.replace(returnUrl)
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        setSignUpField((prev) => ({
            ...prev,
            [name]: value
        }));
        const errorMessage = validateField(name, value);
        setError((prev) => ({
            ...prev,
            [name]: errorMessage,
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name } = e.target;
        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));
    };

    const localHandleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
    }

    const googleHandleClick = () => {
        window.location.href = `${process.env.NEXT_PUBLIC_NEST_API_URL}/auth/google/signin/?returnUrl=${encodeURIComponent(returnUrl)}`;
    }

    return (
        <div className="w-[312px] h-[455px] flex flex-col items-center flex-shrink-0">
            <div className="font-playfairDisplay text-[40px]">Sign Up</div>
            <button type="button" className="font-playfairDisplay text-[16px] text-[#ADADAD] mb-[50px] cursor-pointer hover:text-black duration-300 ease-in-out" onClick={() => setIsSignUp(false)}>Or sign in with your account</button>
            <form className="flex-1 flex flex-col justify-between items-center w-full" onSubmit={handleSubmit}>
                <div className="flex flex-col w-full">
                    <AuthInput name="email" type="email" placeholder="Email" onChange={handleChange} value={signUpField.email} error={error.email} touched={touched.email} onBlur={handleBlur} />
                    <AuthInput name="password" type="password" placeholder="Password" onChange={handleChange} value={signUpField.password} error={error.password} touched={touched.password} onBlur={handleBlur} />
                    <AuthInput name="confirmPassword" type="password" placeholder="Confirm password" onChange={handleChange} value={signUpField.confirmPassword} error={error.confirmPassword} touched={touched.confirmPassword} onBlur={handleBlur} />
                </div>
                <div className="flex flex-col w-full">
                    <button type="submit" disabled={isRequestLoading} className="relative bg-black rounded-full flex justify-start items-center w-full h-[40px] mb-[18px] cursor-pointer hover:bg-black/40 duration-300 ease-in-out" onClick={localHandleClick}>
                        {
                            isRequestLoading ?
                                <div className="h-full w-full flex flex-row justify-center">
                                    <div className="h-full w-[35%] flex flex-row justify-around items-center">
                                        <span className="h-[8px] w-[8px] rounded-full animate-pulse [animation-duration:900ms] bg-white/70" />
                                        <span className="h-[8px] w-[8px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:300ms] bg-white/70" />
                                        <span className="h-[8px] w-[8px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:600ms] bg-white/70" />
                                    </div>
                                </div>
                                :
                                <div className="h-full w-full flex flex-row items-center">
                                    <div className="h-[22px] w-[22px] text-white ml-[12px] mr-[12px]">
                                        <Login />
                                    </div>
                                    <div className="text-white font-roboto text-[16px] font-bold text-nowrap">Sign in</div>
                                </div>
                        }
                        <span ref={spanRef} className="w-[20px] h-[20px] absolute" style={{ left, top }}></span>
                    </button>
                    <button type="button" onClick={googleHandleClick} className="box-border border-solid border-[#ADADAD] border-2 rounded-full flex justify-start items-center w-full h-[40px] cursor-pointer text-[#ADADAD] hover:border-black/60 hover:text-black/60 duration-300 ease-in-out">
                        <div className="h-[22px] w-[22px] text-white ml-[12px] mr-[12px]">
                            <Google />
                        </div>
                        <div className="font-roboto text-[16px] font-bold text-nowrap">Sign up with Google</div>
                    </button>
                </div>
            </form>
        </div>
    )
}