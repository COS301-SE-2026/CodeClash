import type React from 'react';

import { Card } from './card';

import "../../../src/styles/global.css"
import { UserCircle } from 'lucide-react';

interface LeaderboardCardProps{
    children?: React.ReactNode
    className?: string
}

const LeaderboardCardLeft = ({children, className} : LeaderboardCardProps) => {

    return(
        <Card className={`w-[45%] h-[67%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center ${className}`}>
            <div className="flex flex-row grid grid-rows-3">
            <UserCircle className="w-[90px] h-[90px] mx-auto my-auto -mb-5 mt-[15%]"></UserCircle>
                <div className="text-[340%] text-[#AFAEA9] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mb-10 mt-7">2</div>
                <div className="text-[150%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mx-auto mt-[25%]">Username</div>
                <EloText className="mb-[40%] -mt-5">ELO</EloText>
            </div>


            {/* <div className="flex flex-row grid grid-rows-4">
                <UserCircle></UserCircle>
                <div className="text-[340%] text-"
            </div> */}
            {children}
        </Card>
    )

}

export default LeaderboardCardLeft;

//component code copied from above because everything is the same but one changed value so that it can be the reflection of the top component
export const LeaderboardCardRight = ({children, className} : LeaderboardCardProps) => {

    return(
        <Card className={`w-[45%] h-[67%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center ${className}`}>
            <div className="flex flex-row grid grid-rows-3">
            <UserCircle className="w-[90px] h-[90px] mx-auto my-auto -mb-5 mt-[15%]"></UserCircle>
                <div className="text-[340%] text-[#B36548] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -mb-10 mt-7">3</div>
                <div className="text-[150%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mx-auto mt-[25%]">Username</div>
                <EloText className="mb-[40%] -mt-5">ELO</EloText>
            </div>
            {children}
        </Card>
    )

}

interface EloTextProps{
    children?: React.ReactNode
    className?: string
}

export const EloText = ({children, className} : EloTextProps) => {
    return(
        <h1 className={`text-[150%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${className}`}>
        {children}
        </h1>
    )
}