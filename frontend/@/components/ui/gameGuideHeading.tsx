import type React from 'react';

interface GameGuideHeadingProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideHeading = ({children, className} : GameGuideHeadingProps) => {
    return(
        <h1 className={`text-center font-font font-semibold text-[120%] text-button-primary mx-auto ${className}`}>
            {children}
        </h1>
    )
}

export default GameGuideHeading;