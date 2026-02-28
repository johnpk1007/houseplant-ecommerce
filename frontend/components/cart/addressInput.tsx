import { ChangeEvent, FocusEvent } from "react";

export default function AddressInput(
    { name, placeholder, onChange, value, error, touched = true, onBlur }
        :
        { name: string, placeholder: string, onChange: (e: ChangeEvent<HTMLInputElement, Element>) => void, value?: string, error: string, touched?: boolean, onBlur?: (e: FocusEvent<HTMLInputElement, Element>) => void }) {

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
  `}
                onChange={onChange}
                value={value}
                onBlur={onBlur}
            />
            {(error && touched) && <div className="absolute top-full left-0 text-[12px] text-red-500 font-medium ">{error}</div>}
        </div>
    )
}