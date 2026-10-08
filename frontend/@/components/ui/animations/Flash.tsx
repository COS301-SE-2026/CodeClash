// Animation for flashing the answer box with green or red based on correctness

import type React from "react";
import { useEffect, useState, useRef } from "react";
import "../../../../src/styles/global.css"

type FlashProps = {
    result: boolean | null;
    children?: React.ReactNode;
    className?: string;
    trigger: number;
}

const Flash = ({
    result, children, className = '', trigger
} : FlashProps) => {
    const [flash, setFlash] = useState('');
    const resultRef = useRef(result);
    resultRef.current = result;

    useEffect(() => {
        if (trigger === 0 || resultRef.current === null) {
            return;
        }

        setFlash(
            resultRef.current ? 'answer-flash-correct' : 'answer-flash-wrong'
        )

        const timer = setTimeout(() => 
            setFlash(''), 700);

        return () => clearTimeout(timer);
    }, [trigger])

    return (
        <div className= {`${className} ${flash}`}>
            {children}
        </div>
    )
}

export default Flash;