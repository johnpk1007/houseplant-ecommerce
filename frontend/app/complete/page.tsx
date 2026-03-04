'use client'

import { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import Complete from '@/public/images/Complete.webp'

const STATUS_CONTENT_MAP = {
    succeeded: {
        text: "Payment succeeded",
    },
    processing: {
        text: "Your payment is processing.",
    },
    requires_payment_method: {
        text: "Your payment was not successful, please try again.",
    },
    default: {
        text: "Something went wrong, please try again.",
    }
}

export default function CompletePage() {
    const stripe = useStripe();

    const [status, setStatus] = useState("default");
    const [intentId, setIntentId] = useState<string | null>(null);

    useEffect(() => {
        if (!stripe) {
            console.log('no stripe')
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            console.log('no client secret')
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) {
                console.log('no payment intent')
                return;
            }
            console.log('paymentIntent:', paymentIntent)
            setStatus(paymentIntent.status);
            setIntentId(paymentIntent.id);
        });
    }, [stripe]);

    return (<div className="w-full flex flex-row justify-center">
        {/* <h2 id="status-text">{STATUS_CONTENT_MAP[status as keyof typeof STATUS_CONTENT_MAP].text}</h2> */}
        <div className="flex flex-col h-[1000px] w-full">
            <div className="w-full flex-1" />
            <div className="w-full h-[300px] relative">
                <Image src={Complete} alt="Complete" width={0} height={0} className="w-full h-full object-cover relative" />
                <div className="absolute top-0 left-0">hello</div>
            </div>
            <div className="w-full flex-1 flex flex-row justify-end">
                <div className="flex flex-col justify-start items-end pt-[80px] pr-[100px]">
                    <div className="font-playfairDisplay text-[40px] text-right text-balance w-[500px] mb-[60px]">
                        Your Order is Confirmed and Processing.
                    </div>
                    <div className="font-playfairDisplay text-[16px] text-right text-balance w-[700px] text-[#ADADAD]">
                        We are so grateful to welcome you to our community. Your new plants are now being prepared by our expert growers and will be shipped with the utmost care. We encourage you to begin preparing your space and gathering inspiration to truly embrace your slow living journey.
                    </div>
                </div>

            </div>
        </div>
    </div>)
}