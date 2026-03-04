'use client'

import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import GoogleAutocomplete from "./googleAutoComplete";
import { AddressState } from "@/types/addressState";
import AddressInput from "./addressInput";
import Card from "@/public/icons/card.svg"

export default function Address({ stage, setStage, address, setAddress }: { stage: number, setStage: Dispatch<SetStateAction<number>>, address: AddressState, setAddress: Dispatch<SetStateAction<AddressState>> }) {
    const [error, setError] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        extendedAddress: "",
        streetNumber: "",
        route: "",
        locality: "",
        administrativeAreaLevel1: "",
        postalCode: ""
    });

    const [touched, setTouched] = useState({ phoneNumber: false });

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "firstName":
                if (!value.trim()) return "Please enter your first name.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "lastName":
                if (!value.trim()) return "Please enter your last name.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "phoneNumber":
                if (value.length < 14) return "Please enter your full phone number.";
                if (!/^[0-9()\-\s]+$/.test(value)) return "Please enter numbers only.";
                return "";

            case "locality":
                if (!value.trim()) return "Please enter your city.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "administrativeAreaLevel1":
                if (!value.trim()) return "Please enter your state.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "postalCode":
                if (value.length !== 5) return "Please enter your full zipcode";
                if (!/^[0-9]+$/.test(value)) return "Please enter numbers only.";
                return "";

            default:
                return "";
        }
    };

    const formatPhoneNumber = (value: string) => {
        const numbers = value.replace(/\D/g, "");
        if (numbers.length <= 3) {
            return numbers;
        }
        if (numbers.length <= 6) {
            return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
        }
        return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
    };

    const capitalizeFirstLetter = (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        if (name === 'phoneNumber') {
            value = formatPhoneNumber(value)
        }
        if (name === 'firstName' || 'lastName' || 'locality' || 'administrativeAreaLevel1') {
            value = capitalizeFirstLetter(value)
        }
        setAddress((prev) => ({
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

    const spanRef = useRef<HTMLSpanElement>(null);
    const [left, setLeft] = useState(0);
    const [top, setTop] = useState(0);


    const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!spanRef.current) return
        spanRef.current.classList.remove("ripple");
        setLeft(event.clientX - event.currentTarget.getBoundingClientRect().left)
        setTop(event.clientY - event.currentTarget.getBoundingClientRect().top)
        spanRef.current.classList.add("ripple");
        setStage(2)
    }

    const allFilled = Object.values(address).every(value => value !== "");

    return (
        <div className="970px:w-[50%] w-full h-full flex flex-row 970px:justify-start justify-center shrink-0">
            <div className="h-full 970px:block hidden" style={{ width: `${stage !== 1 ? '15%' : '5%'}` }} />
            <div className="970px:w-[80%] 500px:w-[60%] w-[80%] h-full flex flex-col justify-start">
                <div className="w-full h-[75px] border-b-[2px] border-[#E2E2E2] flex flex-row items-center shrink-0">
                    <div className="font-playfairDisplay 1300px:text-[32px] text-[24px]">
                        Address
                    </div>
                </div>
                <div className="w-full flex flex-col 1300px:px-[15%] 1100px:px-[10%] 970px:px-0 py-[14px]">
                    <div className="w-full mb-[20px]">
                        <div className="font-roboto font-light text-[24px] mb-[10px]">Contact information</div>
                        <div className="flex flex-row w-full gap-[18px]">
                            <AddressInput
                                name="firstName"
                                placeholder="First name"
                                onChange={handleChange}
                                value={address.firstName}
                                error={error.firstName}
                            />
                            <AddressInput
                                name="lastName"
                                placeholder="Last name"
                                onChange={handleChange}
                                value={address.lastName}
                                error={error.lastName}
                            />
                        </div>
                        <AddressInput
                            name="phoneNumber"
                            placeholder="Phone number"
                            onChange={handleChange}
                            value={address.phoneNumber}
                            error={error.phoneNumber}
                            touched={touched.phoneNumber}
                            onBlur={handleBlur}
                        />
                    </div>
                    <div className="mb-[5px]">
                        <div className="font-roboto font-light text-[24px] mb-[10px]">Contact information</div>
                        <GoogleAutocomplete setAddress={setAddress} />
                        <AddressInput
                            name="extendedAddress"
                            placeholder="Apt, suite, unit, building, floor, etc"
                            onChange={handleChange}
                            value={address.extendedAddress}
                            error={error.extendedAddress}
                        />
                        <AddressInput
                            name="locality"
                            placeholder="City"
                            onChange={handleChange}
                            value={address.locality}
                            error={error.locality}
                        />
                        <div className="flex flex-row w-full gap-[18px]">
                            <AddressInput
                                name="administrativeAreaLevel1"
                                placeholder="State"
                                onChange={handleChange}
                                value={address.administrativeAreaLevel1}
                                error={error.administrativeAreaLevel1}
                            /> <AddressInput
                                name="postalCode"
                                placeholder="Zipcode"
                                onChange={handleChange}
                                value={address.postalCode}
                                error={error.postalCode}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={handleClick} className={`${allFilled ? 'bg-black border-black' : 'bg-black/40 border-black/10'} self-end rounded-full text-white h-[40px] 750px:w-[240px] w-[190px]  flex flex-row items-center relative overflow-hidden hover:bg-black/40 hover:border-black/10  duration-300 ease-in-out cursor-pointer border-2`}>
                            <div className="750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] 750px:ml-[16px] ml-[10px] mr-[8px] flex-shrink-0">
                                <Card />
                            </div>
                            <div className="font-roboto font-bold  750px:text-[16px] text-[12px] ml-[8px] text-nowrap">PROCEED TO PAYMENT</div>
                            <span ref={spanRef} className="w-[20px] h-[20px] absolute" style={{ left, top }}></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}