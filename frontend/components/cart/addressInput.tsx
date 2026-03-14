import { ChangeEvent, FocusEvent } from "react";

export default function AddressInput(
    { name, placeholder, onChange, value, error, touched = true, onBlur, stage }
        :
        { name: string, placeholder: string, onChange: (e: ChangeEvent<HTMLInputElement, Element>) => void, value?: string, error?: string, touched?: boolean, onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void, stage: number }) {

    return (
        <div className="relative flex-1  mb-[20px]">
            <input
                name={name}
                type="text"
                placeholder={placeholder}
                className={`w-full h-[42px] pl-3 border rounded outline-none transition-all 
                    ${(error && touched)
                        ? 'border-red-500 focus:border-red-500 border-2'
                        : 'border-[#ADADAD] focus:border-2 focus:border-black'
                    }
                    ${stage > 1 && 'text-[#7F7F7F]'}
                 `}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
                disabled={stage !== 1}
            />
            {(error && touched) && <div className="absolute top-full left-0 text-[12px] text-red-500 font-medium ">{error}</div>}
        </div>
    )
}