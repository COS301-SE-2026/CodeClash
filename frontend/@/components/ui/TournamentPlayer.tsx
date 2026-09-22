import React from 'react'

import "../../../src/styles/global.css"
import { MatchCard } from './MatchCard'


interface TournamentPlayerProps{
    children?: React.ReactNode;
    className?: string;
}

export const TournamentPlayer = ({children, className} : TournamentPlayerProps) => {

    return(
        <MatchCard className={`flex flex-row w-auto overflow-x-auto gap-1 min-w-[10%] ${className}`}>
            <div className="bg-[var(--profile-tournaments)] border-[0.5px] my-auto sm:min-w-0 
                border-[var(--button-tournament-secondary)] rounded-sm ml-2 w-10 h-10"
            >   
            </div>
            <h1 className="font-semibold text-sm ml-3 mt-1">Username</h1>
            <h2 className="ml-auto rounded-full bg-card text-green-300 text-xs font-semibold w-auto text-center mt-auto my-auto mr-2 px-1">Ready</h2>
            {children}
        </MatchCard>
    )
}