//the code below was copied and pasted and then changed as much as necessary. It was copied from human-written code
// and its edits are all human-written - this code was not ai generated

//the following code was copied and pasted from another file and then changed
// to save time - it was originally hand-written and all edits to it were hand-written

import React from 'react'

import "../../../src/styles/global.css"
import { MatchCard } from './MatchCard'
import {Check} from "lucide-react"


interface LiveTournamentPlayerProps{
    children?: React.ReactNode;
    className?: string;
    place?: number;
    winner?: boolean;
    you?: boolean;
    username?: string,
    time?: string
}

export const LiveTournamentPlayer = ({children, className, place, winner, you, username, time} : LiveTournamentPlayerProps) => {

    return(
        <MatchCard className={`bg-[#413638] flex flex-row items-center w-auto overflow-x-auto gap-2 px-3 py-2 rounded-lg 
        min-w-[10%] ${winner ? 'bg-[#B5A6A9]' : ""} ${you ? 'bg-primary/20 border-primary' : ""} ${className}`}>
            
            <h1 className={`text-[#B5A6A9] w-4 text-center ${winner ? 'text-[#cd9340]' : ""} ${you ? 'text-primary' : ""}`}>{place}</h1>

            <h1 className="text-secondary">{username}</h1>

            {you ? <MatchCard className="bg-primary border-primary text-secondary rounded-[10px] px-2 py-0.5 text-xs">YOU</MatchCard> : ""}

            <div className="ml-auto text-muted-text text-sm">{time}s</div>
            {children}
        </MatchCard>
    )
}