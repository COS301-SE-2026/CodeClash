import type React from 'react';
import { Card } from './card';
import "../../../src/styles/global.css"

interface LeaderboardCardProps{
    children?: React.ReactNode
    className?: string
}

const LeaderboardCardLeft = ({children, className} : LeaderboardCardProps) => {

    return(
        <Card className={`w-[36%] h-[57%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center ${className}`}>
            {children}
        </Card>
    )

}

//component code copied from above because everything is the same but one changed value so that it can be the reflection of the top component