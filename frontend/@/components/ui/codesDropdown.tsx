//drop down for the country codes

import React, { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { CountryCodes } from "src/utils/countryCodes";

interface DropdownProps {
    value: string;
    onChange: (code: string) => void;
    disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({value, onChange, disabled}) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = CountryCodes.find((c) => c.code === value) ?? CountryCodes[0];
    const SelectedFlag = selected.flagIcon;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])

    return (
        <div className="relative w-[84px] shrink-0" ref={ref}>
            <button type="button" className="input w-full flex items-center justify-between pl-3 pr-2 py-3 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => setIsOpen((prev) => !prev)} disabled= {disabled}>
                <span className="flex items-center gap-1.5 text-xsm">
                    <SelectedFlag className='w-4 h-auto rounded-[2px]'/>
                    <span>{selected.code}</span>
                </span>
                <ChevronDown size={18} className={`text-muted-text transition-transform ${isOpen? 'rotate-180' : ''}`}/>
            </button>

            {isOpen && (
                <div className="absolute z-30 mt-2 w-36 max-h-64 overflow-y-auto rounded-2xl border border-border bg-background backdrop-blur-md shadow-lg">
                    {CountryCodes.map((country) => {
                        const Flag = country.flagIcon;
                        return (
                            <button key={country.code} type="button" className="w-full flex items-center gap-2 px-4 py-2.5 text-xsm text-left hover:bg-white/10 transition-colors text-primary-text"
                                onClick={() => { onChange(country.code); setIsOpen(false);}}>
                                <Flag className="w-4 h-auto rounded-[2px]"/>
                                <span>{country.code}</span>
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default Dropdown;