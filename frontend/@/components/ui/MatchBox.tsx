//all the code pasted below was pasted from a file that had hand-written code and was just pasted here for the
//sake of time, ai did not generate this code

import React from "react"
import "../../../src/styles/global.css"
import { Card } from "./card"
import { Timer } from "lucide-react"


interface MatchBoxProps{
    children?: React.ReactNode;
    className?: string;
}


export const MatchBox = ({children, className} : MatchBoxProps) => {
    return(
        <Card className={`bg-[var(--match-box)] border-[var(--button-tournament-secondary)] 
            border-[0.5px] ${className}`}>
            
            {children}
        </Card>
    );
}

export const TimerCard = ({children, className} : MatchBoxProps) => {
    return(
        <MatchBox className={`flex text-white font-dseg border border-[var(--match-card)]
            h-6 w-38 flex items-center justify-center text-[70%] text-center font-semibold rounded-sm ${className}`}>
                <div className="flex flex-row whitespace-wrap">
                    <Timer size={20} className="my-auto mr-3 text-muted-text"/>
                    {children}
                </div>
        </MatchBox>
    );
}

