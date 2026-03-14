'use client'

import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { createPaymentIntent } from "@/services/clientSide/cart";
import { useCartItemStore } from "@/services/stores/cartItemStore"
import PaymentForm from "./paymentForm";
import { useClientSecretStore } from "@/services/stores/clientSecretStore";
import { AddressState } from "@/types/addressState";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_PUBLISHABLE_KEY as string)

export default function PaymentRequest({ stage, setStage, address, setAddress }: { stage: number, setStage: Dispatch<SetStateAction<number>>, address: AddressState, setAddress: Dispatch<SetStateAction<AddressState>> }) {
    const cartItemsArray = useCartItemStore((state) => state.cartItemsArray)
    const clientSecret = useClientSecretStore((state) => state.clientSecret)
    const setClientSecret = useClientSecretStore((state => state.setClientSecret))

    useEffect(() => {
        if (clientSecret || !address) return;
        const creatPaymentWrapper = async (cartItemIdArray: number[]) => {
            try {
                const data = await createPaymentIntent({ cartItemIdArray, addressState: address });
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Failed to create payment intent:", error);
            }
        }
        if (cartItemsArray && stage === 2) {
            const cartItemIdArray = cartItemsArray.map((item) => item.id)
            creatPaymentWrapper(cartItemIdArray)
        }
    }, [cartItemsArray, stage, clientSecret, address]);

    const options: StripeElementsOptions = {
        clientSecret,
        loader: 'never',
        locale: 'en',
        appearance: {
            theme: 'stripe',
            rules: {
                '.Label': {
                    opacity: '0'
                },
                '.Input': {
                    boxShadow: 'none',
                    borderColor: '#ADADAD'
                },
                '.Input:focus': {
                    boxShadow: 'none',
                    borderWidth: '2px',
                    borderColor: 'black'
                },
                '.Input--invalid': {
                    borderColor: '#FF0031'
                },
                '.Error': {
                    color: '#FF0031',
                    fontSize: '12px'
                },

            },
            variables: {
                spacingGridRow: '-3px'
            }
        },
    }

    return (
        <div className="970px:w-[50%] w-full h-full flex flex-row 970px:justify-start justify-center shrink-0" >
            <div className="h-full 970px:block hidden" style={{ width: '5%' }} />
            <div className="970px:w-[80%] 500px:w-[70%] w-full h-full flex flex-col items-center">
                <div className="w-full h-[75px] border-b-[2px] border-[#E2E2E2] flex flex-row items-center shrink-0 mb-[4px]">
                    <div className="font-playfairDisplay 1300px:text-[32px] text-[24px]">
                        Payment
                    </div>
                </div>
                {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                        <PaymentForm address={address} />
                    </Elements>
                )}
            </div>
        </div >
    )
}