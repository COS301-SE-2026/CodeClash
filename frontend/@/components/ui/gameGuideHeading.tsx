import type React from 'react';
import { Card } from "./card";

interface gameGuideHeadingProps{
    children?: React.ReactNode
    className?: string
}

const GameGuideHeading = ({children, className} : gameGuideHeadingProps) => {
    return(
        <Card className={`text-center font-font font-semibold text-[120%] text-button-primary -mt-[26%] -ml-[1%] ${className}`}>
            {children}
        </Card>
    )
}

export default GameGuideHeading;