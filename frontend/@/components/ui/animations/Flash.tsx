// Animation for flashing the answer box with green or red based on correctness

import type React from "react";
import { useEffect, useState } from "react";

type FlashProps = {
    result: boolean | null;
    children: React.ReactNode;
    className?: string;
    trigger: number;
}

const Flash = ({
    result, children, className = '', trigger
} : FlashProps) => {
    const [flash, setFlash] = useState('');

    useEffect(() => {
        if (trigger === 0 || result === null) {
            return;
        }

        setFlash(
            result ? 'answer-flash-correct' : 'answer-flash-wrong'
        )

        const timer = setTimeout(() => {
            setFlash('')
        }, 700);

        return () => clearTimeout(timer);
    }, [trigger, result])

    return (
        <div className= {`${className} ${flash}`}>
            {children}
        </div>
    )
}

export default Flash;