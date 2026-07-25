import type React from 'react';
import { Card } from './card';
import "../../../src/styles/global.css"
import profile from "../../../src/assets/Icons/profile_black.png"

interface LeaderboardCardProps{
    children?: React.ReactNode
    className?: string
}

const LeaderboardCardLeft = ({children, className} : LeaderboardCardProps) => {

    return(
        <Card className={`w-[45%] h-[55%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center ${className}`}>
            <div style={{backgroundImage : `url(${profile})`}} className="w-[85px] h-[85px] bg-no-repeat rounded-full object-cover bg-size-[auto_167px] bg-[right_-41px_top_-42px] -mt-[85%]">
                <div className="text-[340%] text-[#AFAEA9] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mt-[83%]">2</div>
                <div className="text-[150%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-7">Username</div>
                <EloText></EloText>
            </div>
            {children}
        </Card>
    )

}

export default LeaderboardCardLeft;

//component code copied from above because everything is the same but one changed value so that it can be the reflection of the top component
export const LeaderboardCardRight = ({children, className} : LeaderboardCardProps) => {

    return(
        <Card className={`w-[45%] h-[55%] rounded-[20px] bg-secondary border-4 border-button-primary drop-shadow-[-10px_10px_6px_rgba(0,0,0,0.25)] flex flex-col items-center justify-center ${className}`}>
            <div style={{backgroundImage : `url(${profile})`}} className="w-[85px] h-[85px] bg-no-repeat rounded-full object-cover bg-size-[auto_167px] bg-[right_-41px_top_-42px] -mt-[85%]">
                <div className="text-[340%] text-[#B36548] text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] mt-[83%]">3</div>
                <div className="text-[150%] text-button-primary text-center justify-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] -ml-7">Username</div>
                <EloText></EloText>
            </div>
            {children}
        </Card>
    )

}

interface EloTextProps{
    children?: React.ReactNode
    className?: string
}

const EloText = ({children, className} : EloTextProps) => {
    return(
        <h1 className={`text-[150%] text-button-primary text-center font-[var(--font)] font-semibold drop-shadow-[0px_4px_4px_rgba(0,0,0,0.25)] ${className}`}>ELO
        {children}
        </h1>
    )
}