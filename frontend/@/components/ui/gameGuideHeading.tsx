import type React from 'react';

interface gameGuideHeadingProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideHeading = ({children, className} : gameGuideHeadingProps) => {
    return(
        <h1 className={`text-center font-font font-semibold text-[120%] text-button-primary -mt-[10%] -ml-[2%] ${className}`}>
            {children}
        </h1>
    )
}

export default GameGuideHeading;