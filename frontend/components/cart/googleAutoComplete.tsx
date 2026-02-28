'use client'

import { AddressState } from "@/types/addressState";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { useRef, useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from "react";

export default function GoogleAutocomplete({ setAddress }: { setAddress: Dispatch<SetStateAction<AddressState>> }) {
    const serviceRef = useRef<any>(null);
    const placesServiceRef = useRef<any>(null);
    const tokenClassRef = useRef<any>(null);
    const sessionTokenRef = useRef<any>(null);
    const isSelectingRef = useRef<boolean>(false);

    const [value, setValue] = useState("");
    const [error, setError] = useState("")
    const [predictions, setPredictions] = useState<any[]>([]);

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

        if (!serviceRef.current || value.length < 2) {
            setPredictions([]);
            return;
        }
        const timer = setTimeout(() => {
            if (!sessionTokenRef.current && tokenClassRef.current) {
                sessionTokenRef.current = new tokenClassRef.current();
            }
            serviceRef.current.getPlacePredictions(
                {
                    input: value,
                    sessionToken: sessionTokenRef.current,
                    types: ["address"]
                },
                (results: any) => {
                    setPredictions(results || []);
                }
            );
        }, 300)

        return () => clearTimeout(timer);
    }, [value]);

    const capitalizeFirstLetter = (value: string) => {
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    };

    const validateField = (value: string) => {
        if (!value.trim()) return "Please enter your street address.";
        if (!/^[A-Za-z0-9]+$/.test(value)) return "Please enter letters and numbers only.";
        return "";
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        let { value } = e.target;
        value = capitalizeFirstLetter(value)
        setValue(value);
        const errorMessage = validateField(value);
        setError(errorMessage)
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

                setAddress((prev) => ({
                    ...prev,
                    ...componentMap
                }));

                const formatted = [componentMap.street_number, componentMap.route]
                    .filter(Boolean)
                    .join(" ");
                isSelectingRef.current = true
                setValue(formatted);
                setPredictions([]);
                sessionTokenRef.current = null;
            }
        );
    };

    return (
        <div className="w-full relative h-[42px] mb-[20px]">
            <input
                value={value}
                placeholder="Street address"
                onChange={handleChange}
                className={`w-full h-full pl-3 border border-[#ADADAD] rounded outline-none transition-all 
                       ${error
                        ? 'border-red-500 focus:border-red-500 border-2'
                        : 'border-[#ADADAD] focus:border-2 focus:border-black'
                    }
                    `}
            />
            {(error) && <div className="absolute top-full left-0 text-[12px] text-red-500 font-medium ">{error}</div>}
            {predictions.length > 0 && (
                <ul className="absolute w-full top-full left-0 z-1 border-2 border-[#E2E2E2]">
                    {predictions.map((p) => (
                        <li
                            key={p.place_id}
                            onClick={() => handleSelect(p.place_id)}
                            className="pl-3 cursor-pointer bg-white border-b-1 border-[#E2E2E2] hover:bg-gray-100"
                        >
                            {p.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}