import React from 'react'
import { MatchCard } from '../../ui/MatchCard'
import type { PlayerDTO } from 'src/dtos/match/match.dto';


interface TournamentPlayerProps {
    children?: React.ReactNode;
    className?: string;
    player: PlayerDTO
}

export const TournamentPlayer = ({ children, className, player }: TournamentPlayerProps) => {

    return (
        <MatchCard className={`flex flex-row w-auto overflow-x-auto gap-1 min-w-[10%] ${className}`}>
            <div className="bg-profile-tournaments border-[0.5px] my-auto sm:min-w-0 
                border-button-tournament-secondary rounded-sm ml-2 w-10 h-10"
            >
            </div>
            <h1 className="font-semibold text-sm ml-3 mt-1">{player.username}</h1>
            {children}
        </MatchCard>
    )
}