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
    const selectedFlag = selected.flagIcon;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [])
}