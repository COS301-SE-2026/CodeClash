import React from "react"
import "../../../src/styles/global.css"
import { Card } from "../ui/card"


interface MatchCardProps{
    children?: React.ReactNode;
    className?: string;
}


export const MatchCard = ({children, className} : MatchCardProps) => {
    return(
        <Card className={`bg-[var(--card-tournaments)] border-[var(--button-tournament-secondary)] 
            border-[0.5px] ${className}`}>
            
            {children}
        </Card>
    );
}

