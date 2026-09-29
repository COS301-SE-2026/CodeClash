//the code below was copied and pasted and then changed as much as necessary. It was copied from human-written code
// and its edits are all human-written - this code was not ai generated

import React from 'react'
import { MatchCard } from '@/components/features/Match/MatchCard'


interface LiveTournamentPlayerProps {
    children?: React.ReactNode;
    className?: string;
    place?: number;
    winner?: boolean;
    you?: boolean;
    username?: string,
    time?: string
}

export const LiveTournamentPlayer = ({ children, className, place, winner, you, username, time }: LiveTournamentPlayerProps) => {

    const position = (place && place > 0) ? place : "";

    return (
        <MatchCard className={`bg-[#413638] flex flex-row items-center w-auto h-11 overflow-x-auto gap-2 px-3 py-2 rounded-[10px] text-xs
        min-w-[10%] ${winner ? 'bg-[#827474]' : ""} ${you ? 'bg-primary/20 border-primary' : ""} ${className}`}>

            <h1 className={`text-[#B5A6A9] w-4 text-center ${winner ? 'text-[#cd9340]' : ""} ${you ? 'text-primary' : ""}`}>{position}</h1>

            <h1 className="text-secondary">{username}</h1>

            {you ? <MatchCard className="bg-primary border-primary text-secondary rounded-[10px] px-2 py-0.5 text-xs">YOU</MatchCard> : ""}

            <div className="ml-auto text-muted-text text-xs">{time}s</div>
            {children}
        </MatchCard>
    )
}