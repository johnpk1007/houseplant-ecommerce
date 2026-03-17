import { useState, useRef } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { StripePaymentElementOptions } from "@stripe/stripe-js";
import Buy from "@/public/icons/buy.svg"
import { AddressState } from "@/types/addressState";
import { errorToast } from "@/services/toast/toast";

export default function PaymenForm({ address }: { address: AddressState }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isInitialLoading, setIsInitialLoading] = useState(false);
    const [isRequestLoading, setIsRequestLoading] = useState(false);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsRequestLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_PRODUCTION_FRONTEND_URL : process.env.NEXT_PUBLIC_DEV_FRONTEND_URL}/complete`,
                payment_method_data: {
                    billing_details: {
                        address: {
                            country: "US",
                            postal_code: address.postalCode
                        }
                    }
                }
            },
        });

        if (error.type === "card_error" || error.type === "validation_error") {
            errorToast(error.message as string)
        } else {
            errorToast("An unexpected error occurred.")
            errorToast(error.message as string)
        }
        setIsRequestLoading(false);
    };

    const paymentElementOptions: StripePaymentElementOptions = {
        layout: "tabs",
        paymentMethodOrder: ['card'],
        wallets: {
            link: 'never'
        },
        fields: {
            billingDetails: {
                address: {
                    country: 'never',
                    postalCode: 'never'
                }
            }
        },
    }

    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
    }

    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="w-[350px] h-[250px] px-[20px] pt-[35px] relative">
            {!isInitialLoading &&
                <div className="w-full h-full flex flex-col justify-start">
                    <div className="w-full h-[45px] mt-[25px] rounded bg-gray-200 animate-pulse " />
                    <div className="w-full h-[45px] mt-[20px] flex flex-row gap-[15px]">
                        <div className="flex-1 h-full rounded bg-gray-200 animate-pulse " />
                        <div className="flex-1 h-full rounded bg-gray-200 animate-pulse " />
                    </div>
                </div>}
            <div className="font-roboto font-light text-[24px] absolute top-[10px]">Card information</div>
            <PaymentElement id="payment-element" options={paymentElementOptions} onReady={() => setIsInitialLoading(true)} />
            {isInitialLoading &&
                <div className="w-full flex justify-end">
                    <button disabled={isRequestLoading || !stripe || !elements} onClick={handleClick} className="rounded-full bg-black text-white h-[40px] 750px:w-[240px] w-[190px] mt-[30px]  flex flex-row items-center relative overflow-hidden hover:bg-black/40 duration-300 ease-in-out cursor-pointer">
                        {isRequestLoading ?
                            <div className="h-full w-full flex flex-row justify-center">
                                <div className="h-full w-[35%] flex flex-row justify-around items-center">
                                    <span className="h-[8px] w-[8px] rounded-full animate-pulse [animation-duration:900ms] bg-white/70" />
                                    <span className="h-[8px] w-[8px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:300ms] bg-white/70" />
                                    <span className="h-[8px] w-[8px] rounded-full animate-pulse [animation-duration:900ms] [animation-delay:600ms] bg-white/70" />
                                </div>
                            </div>
                            :
                            <div className="h-full w-full flex justify-start items-center ">
                                <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px] flex-shrink-0">
                                    <Buy />
                                </div>
                                <div className="font-roboto 750px:text-[16px] text-[12px] font-bold text-nowrap text-inherit">ORDER NOW</div>
                            </div>
                        }
                        <span ref={spanRef} className="w-[20px] h-[20px]" style={{ left, top }}></span>
                    </button>
                </div>
            }
        </form>
    )
}