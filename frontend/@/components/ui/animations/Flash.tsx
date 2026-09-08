// Animation for flashing the answer box with green or red based on correctness

import type React from "react";

type FlashProps = {
    result: boolean | null;
    children: React.ReactNode;
    className?: string;
}

const Flash = ({
    result, children, className = ''
} : FlashProps) => {
    const animation = 
    result === true ? 'answer-flash-correct' : result === false ? 'answer-flash-wrong' : '';

    return (
        <div className= {`${animation} ${className}`}>
            {children}
        </div>
    )
}

export default Flash;