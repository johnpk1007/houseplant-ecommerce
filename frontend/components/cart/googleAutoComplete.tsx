'use client'

import { AddressState } from "@/types/addressState";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { useRef, useEffect, useState, Dispatch, SetStateAction, ChangeEvent } from "react";

export default function GoogleAutocomplete({ streetAddress, setAddress, error, setError, stage }: {
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
    }>>,
    stage: number
}) {
    const serviceRef = useRef<any>(null);
    const tokenRef = useRef<any>(null);
    const tokenClassRef = useRef<any>(null);
    const isSelectingRef = useRef<boolean>(false);
    const [predictions, setPredictions] = useState<any[]>([]);
    const [clicked, setClicked] = useState(false)
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    useEffect(() => {
        const init = async () => {
            setOptions({
                key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
                language: "en",
                region: "US"
            });
            const { Place, AutocompleteSessionToken, AutocompleteSuggestion } =
                (await importLibrary(
                    'places'
                )) as google.maps.PlacesLibrary;
            serviceRef.current = AutocompleteSuggestion;
            tokenClassRef.current = AutocompleteSessionToken;
        };
        init();
    }, []);

    const fetchSuggestion = async (input: string) => {
        try {
            const { suggestions } = await serviceRef.current.fetchAutocompleteSuggestions({
                input,
                sessionToken: tokenRef.current,
                includedPrimaryTypes: ["geocode"],
                includedRegionCodes: ["us"]
            });
            return suggestions
        } catch (error) {
            return [];
        }

    }

    useEffect(() => {
        if (isSelectingRef.current) {
            isSelectingRef.current = false;
            return;
        }
        if (!serviceRef.current || streetAddress === undefined || streetAddress.length < 3) {
            setPredictions([]);
            return;
        }
        if (!tokenRef.current && tokenClassRef.current) {
            tokenRef.current = new tokenClassRef.current();
        }
        const timer = setTimeout(async () => {
            const suggestions = await fetchSuggestion(streetAddress)
            const placePredictions = suggestions.map((suggestion: any) => ({
                description: suggestion.placePrediction.text.text,
                placeId: suggestion.placePrediction.placeId,
                original: suggestion
            }))
            setPredictions(placePredictions)
        }, 300)
        return () => clearTimeout(timer);
    }, [streetAddress]);

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
                e.preventDefault();
                setSelectedIndex((prev) => (prev < predictions.length - 1 ? prev + 1 : 0));
                break;
            case "ArrowUp":
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : predictions.length - 1));
                break;
            case "Enter":
                if (selectedIndex >= 0) {
                    e.preventDefault();
                    handleSelect(predictions[selectedIndex].original);
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

    const handleSelect = async (suggestion: any) => {
        const place = suggestion.placePrediction.toPlace()
        await place.fetchFields({
            fields: ['addressComponents'],
        });
        const components = place.addressComponents
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
                componentMap[type] = component.longText;
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
        setClicked(false)
        setPredictions([]);
        tokenRef.current = null
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
                      ${stage > 1 && 'text-[#7F7F7F]'}
                    `}
                disabled={stage !== 1}
            />
            {(error) && <div className="absolute top-full left-0 text-[12px] text-red-500 font-medium ">{error}</div>}
            {(predictions.length > 0 && clicked) && (
                <ul className="absolute w-full top-full left-0 z-1 border-2 border-[#E2E2E2]">
                    {predictions.map((prediction, index) => (
                        <li
                            key={prediction.placeId}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => handleSelect(prediction.original)}
                            className={`pl-3 cursor-pointer border-b-1 border-[#E2E2E2] hover:bg-gray-100 ${selectedIndex === index ? 'bg-gray-100' : 'bg-white hover:bg-gray-100'}`}
                        >
                            {prediction.description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}