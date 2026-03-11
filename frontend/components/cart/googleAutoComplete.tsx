'use client'

import { AddressState } from "@/types/addressState";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { useRef, useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from "react";

export default function GoogleAutocomplete({ streetAddress, setAddress, error, setError }: {
    streetAddress: string | undefined,
    setAddress: Dispatch<SetStateAction<AddressState>>,
    error: string, setError: Dispatch<SetStateAction<{
        firstName: string;
        lastName: string;
        phoneNumber: string;
        streetAddress: string;
        extendedAddress?: string;
        locality: string;
        administrativeAreaLevel1: string;
        postalCode: string;
    }>>
}) {
    const serviceRef = useRef<any>(null);
    const placesServiceRef = useRef<any>(null);
    const tokenClassRef = useRef<any>(null);
    const sessionTokenRef = useRef<any>(null);
    const isSelectingRef = useRef<boolean>(false);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        const init = async () => {
            setOptions({
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: "en",
                region: "US"
            });
            const { AutocompleteService, PlacesService, AutocompleteSessionToken } =
                await importLibrary("places");
            serviceRef.current = new AutocompleteService();
            tokenClassRef.current = AutocompleteSessionToken;
            const div = document.createElement("div");
            placesServiceRef.current = new PlacesService(div);
        };
        init();
    }, []);

    useEffect(() => {
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }

        if (!serviceRef.current || streetAddress === undefined || streetAddress.length < 2) {
            setPredictions([]);
            return;
        }
        const timer = setTimeout(() => {
            if (!sessionTokenRef.current && tokenClassRef.current) {
                sessionTokenRef.current = new tokenClassRef.current();
            }
            serviceRef.current.getPlacePredictions(
                {
                    input: streetAddress,
                    sessionToken: sessionTokenRef.current,
                    types: ["address"]
                },
                (results: any) => {
                    setPredictions(results || []);
                }
            );
        }, 300)

        return () => clearTimeout(timer);
    }, [streetAddress]);

    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    useEffect(() => {
        setSelectedIndex(-1);
    }, [predictions]);

    const capitalizeFirstLetter = (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    };

    const validateField = (value: string) => {
        if (!value.trim()) return "Please enter your street address.";
        if (!/^[A-Za-z0-9 ]+$/.test(value)) return "Please enter letters and numbers only.";
        return "";
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (predictions.length === 0) return;
        switch (e.key) {
            case "ArrowDown":
                console.log('key down')
                e.preventDefault();
                setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0));
                console.log(selectedIndex)
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1));
                break;
            case "Enter":
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSelect(predictions[selectedIndex].place_id);
                }
                break;
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (clicked === false) { setClicked(true) }
        let { value } = e.target;
        value = capitalizeFirstLetter(value)
        setAddress((prev) => ({
            ...prev,
            streetAddress: value
        }));
        const errorMessage = validateField(value);
        setError((prev) => ({
            ...prev,
            streetAddress: errorMessage
        }))
    }

    const handleSelect = (placeId: string) => {
        if (!placesServiceRef.current || !sessionTokenRef.current || isSelectingRef.current) return;
        placesServiceRef.current.getDetails(
            {
                placeId,
                fields: ["address_components"],
                sessionToken: sessionTokenRef.current
            },
            (place: any) => {
                const components = place.address_components
                const componentMap: Record<string, string> = {
                    street_number: "",
                    route: "",
                    locality: "",
                    administrative_area_level_1: "",
                    postal_code: "",
                };

                components.forEach((component: any) => {
                    const type = component.types[0];
                    if (componentMap.hasOwnProperty(type)) {
                        componentMap[type] = component.long_name;
                    }
                });

                const formatted = [componentMap.street_number, componentMap.route]
                    .filter(Boolean)
                    .join(" ");

                setAddress((prev) => ({
                    ...prev,
                    streetAddress: formatted,
                    locality: componentMap.locality,
                    administrativeAreaLevel1: componentMap.administrative_area_level_1,
                    postalCode: componentMap.postal_code
                }));
                setError((prev) => ({
                    ...prev,
                    streetAddress: "",
                    locality: "",
                    administrativeAreaLevel1: "",
                    postalCode: ""
                }))

                isSelectingRef.current = true
                setPredictions([]);
                sessionTokenRef.current = null;
            }
        );
    };

    return (
        <div className="w-full relative h-[42px] mb-[20px]">
            <input
                name="streetAddress"
                value={streetAddress}
                placeholder="Street address"
                onClick={() => setClicked(true)}
                onBlur={() => setClicked(false)}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`w-full h-full pl-3 border border-[#ADADAD] rounded outline-none transition-all 
                       ${error
                        ? 'border-red-500 focus:border-red-500 border-2'
                        : 'border-[#ADADAD] focus:border-2 focus:border-black'
                    }
                    `}
            />
            {(error) && <div className="absolute top-full left-0 text-[12px] text-red-500 font-medium ">{error}</div>}
            {(predictions.length > 0 && clicked) && (
                <ul className="absolute w-full top-full left-0 z-1 border-2 border-[#E2E2E2]">
                    {predictions.map((p, index) => (
                        <li
                            key={p.place_id}
                            onClick={() => handleSelect(p.place_id)}
                            className={`pl-3 cursor-pointer border-b-1 border-[#E2E2E2] hover:bg-gray-100 ${selectedIndex === index ? 'bg-gray-100' : 'bg-white hover:bg-gray-100'}`}
                        >
                            {p.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}