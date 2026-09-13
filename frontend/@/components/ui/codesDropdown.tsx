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
        <div className="relative w-[105px] shrink-0" ref={ref}>
            <button type="button" className="input w-full flex items-center justify-between pl-3 pr-2 cursor-pointer disabled:cursor-not-allowed"
                onClick={() => setIsOpen((prev) => !prev)} disabled= {disabled}>
                <span className="flex items-center gap-1.5 text-sm">
                    <SelectedFlag className='w-5 h-auto rounded-[2px]'/>
                    <span>{selected.code}</span>
                </span>
                <ChevronDown size={16} className={`text-muted-text transition-transform ${isOpen? 'rotate-180' : ''}`}/>
            </button>
        </div>
    )
}