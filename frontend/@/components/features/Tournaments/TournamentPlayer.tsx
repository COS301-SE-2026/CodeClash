import React from 'react'
import { MatchCard } from '@/components/features/Match/MatchCard'
import type { PlayerDTO } from 'src/dtos/match/match.dto';


interface TournamentPlayerProps {
    children?: React.ReactNode;
    className?: string;
    player: PlayerDTO
}

export const TournamentPlayer = ({ children, className, player }: TournamentPlayerProps) => {

    return (
        <MatchCard className={`flex flex-row items-center w-full p-4! gap-3! ${className ?? ''}`}>
            <div className="bg-[var(--profile-tournaments)] border-2 border-priamry rounded-full w-10 h-10 shrink-0" />
            
            <h1 className="text-sm font-bold text-secondary truncate min-w-0">{player.username}</h1>
            {children}
        </MatchCard>
    )
}