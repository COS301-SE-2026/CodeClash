//all the code pasted below was pasted from a file that had hand-written code and was just pasted here for the
//sake of time, ai did not generate this code

import React from "react"
import "../../../src/styles/global.css"
import { Card } from "../ui/card"


interface TimerBoxProps{
    children?: React.ReactNode;
    className?: string;
}


export const TimerBox = ({children, className} : TimerBoxProps) => {
    return(
        <Card className={`bg-[var(--match-box)] border-[var(--button-tournament-secondary)] 
            border-[0.5px] ${className}`}>
            
            {children}
        </Card>
    );
}

