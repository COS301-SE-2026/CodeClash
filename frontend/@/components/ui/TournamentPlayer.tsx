import React from 'react'

import { Card } from "../ui/Card"
import "../../../src/styles/global.css"


interface TournamentPlayerProps{
    children?: React.ReactNode;
    className?: string;
}

export const TournamentPlayer = ({children, className} : TournamentPlayerProps) => {

    return(
        <Card className={`bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-row ${className}`}>
            <h1 className="font-semibold text-md">Username</h1>
            {children}
        </Card>
    )
}