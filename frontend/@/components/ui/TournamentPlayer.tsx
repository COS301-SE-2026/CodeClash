import React from 'react'

import { Card } from "../ui/card"
import "../../../src/styles/global.css"


interface TournamentPlayerProps{
    children?: React.ReactNode;
    className?: string;
}

export const TournamentPlayer = ({children, className} : TournamentPlayerProps) => {

    return(
        <Card className={`bg-card border-[var(--button-tournament-secondary)] border-[0.5px] flex flex-row ${className}`}>
            <h1 className="font-semibold text-md ml-5">Username</h1>
            <h2 className="ml-auto rounded-full bg-card text-green-300 font-semibold mr-5 w-20 text-center mt-auto my-auto">Ready</h2>
            {children}
        </Card>
    )
}