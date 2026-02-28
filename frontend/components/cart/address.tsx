'use client'

import { ChangeEvent, useRef, useState } from "react";
import GoogleAutocomplete from "./googleAutoComplete";
import { AddressState } from "@/types/addressState";
import AddressInput from "./addressInput";

export default function Address() {
    const [address, setAddress] = useState<AddressState>({
        first_name: "",
        last_name: "",
        phone_number: "",
        extended_address: "",
        street_number: "",
        route: "",
        locality: "",
        administrative_area_level_1: "",
        postal_code: ""
    });

    const [error, setError] = useState({
        first_name: "",
        last_name: "",
        phone_number: "",
        extended_address: "",
        street_number: "",
        route: "",
        locality: "",
        administrative_area_level_1: "",
        postal_code: ""
    });

    const [touched, setTouched] = useState({ phone_number: false });

    const validateField = (name: string, value: string) => {
        switch (name) {
            case "first_name":
                if (!value.trim()) return "Please enter your first name.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "last_name":
                if (!value.trim()) return "Please enter your last name.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "phone_number":
                if (value.length < 14) return "Please enter your full phone number.";
                if (!/^[0-9()\-\s]+$/.test(value)) return "Please enter numbers only.";
                return "";

            case "locality":
                if (!value.trim()) return "Please enter your city.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "administrative_area_level_1":
                if (!value.trim()) return "Please enter your state.";
                if (!/^[A-Za-z]+$/.test(value)) return "Please enter letters only.";
                return "";

            case "zipcode":
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
        if (name === 'phone_number') {
            value = formatPhoneNumber(value)
        }
        if (name === 'first_name' || 'last_name' || 'locality' || 'administrative_area_level_1') {
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
    }

    const allFilled = Object.values(address).every(value => value !== "");
    console.log('address:', address)
    console.log('allFilled:', allFilled)

    return (
        <div className="970px:w-[50%] w-full h-full flex flex-row 970px:justify-start justify-center shrink-0">
            <div className="h-full 970px:block hidden" style={{ width: '5%' }} />
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
                                name="first_name"
                                placeholder="First name"
                                onChange={handleChange}
                                value={address.first_name}
                                error={error.first_name}
                            />
                            <AddressInput
                                name="last_name"
                                placeholder="Last name"
                                onChange={handleChange}
                                value={address.last_name}
                                error={error.last_name}
                            />
                        </div>
                        <AddressInput
                            name="phone_number"
                            placeholder="Phone number"
                            onChange={handleChange}
                            value={address.phone_number}
                            error={error.phone_number}
                            touched={touched.phone_number}
                            onBlur={handleBlur}
                        />
                    </div>
                    <div className="mb-[5px]">
                        <div className="font-roboto font-light text-[24px] mb-[10px]">Contact information</div>
                        <GoogleAutocomplete setAddress={setAddress} />
                        <AddressInput
                            name="extended_address"
                            placeholder="Apt, suite, unit, building, floor, etc"
                            onChange={handleChange}
                            value={address.extended_address}
                            error={error.extended_address}
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
                                name="administrative_area_level_1"
                                placeholder="State"
                                onChange={handleChange}
                                value={address.administrative_area_level_1}
                                error={error.administrative_area_level_1}
                            /> <AddressInput
                                name="postal_code"
                                placeholder="Zipcode"
                                onChange={handleChange}
                                value={address.postal_code}
                                error={error.postal_code}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="button" onClick={handleClick} className={`${allFilled ? 'bg-black border-black' : 'bg-black/40 border-black/10'} self-end rounded-full text-white h-[40px] 750px:w-[240px] w-[190px]  flex flex-row items-center relative overflow-hidden hover:bg-black/40 hover:border-black/10  duration-300 ease-in-out cursor-pointer border-2`}>
                            <div className="font-roboto font-bold  750px:w-[24px] 750px:h-[24px] w-[18px] h-[18px] rounded-full border-white border-2 text-[16px] flex justify-center items-center ml-[10px] shrink-0">$</div>
                            <div className="font-roboto font-bold  750px:text-[16px] text-[12px] ml-[8px] text-nowrap">PROCEED TO PAYMENT</div>
                            <span ref={spanRef} className="w-[20px] h-[20px] absolute" style={{ left, top }}></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}