import React from 'react'
import { Calculator, ArrowRight, CodeXml, X } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { MatchCard } from '@/components/features/Match/MatchCard'
import type { MatchMode, PlayerDTO } from 'src/dtos/match/match.dto'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useDbId } from 'src/ViewModels/Tournaments/useDbId'

interface TournamentCardProps {
    id: string
    match_mode: MatchMode,
    children?: React.ReactNode
    className?: string,
    title: string,
    min_players: number,
    player_count: number,
    onJoin: (tournament_id: string) => Promise<boolean>
    onLeave: (tournament_id: string) => Promise<boolean>
    host_player: PlayerDTO,
    players: PlayerDTO[],
}

//Any copied and pasted code below was all hand-written and pasted for the sake of saving time, ai did not generate this code

export const TournamentCard = ({
    id,
    match_mode,
    children,
    className,
    title,
    min_players,
    player_count,
    onJoin,
    onLeave,
    host_player,
    players,
}: TournamentCardProps) => {


    const db_id = useDbId();

    const nav = useNavigate();
    const Icon = match_mode === 'math' ? Calculator : CodeXml;
    const progress = Math.min(100, (player_count / min_players) * 100);
    const joined = players.some((p) => p?.id === db_id);
    const is_host = host_player.id === db_id;

    if (!db_id) return null;

    const handleJoin = async () => {
        const ok = await onJoin(id);

        if (ok) await nav(`/tournaments/waiting/${id}`);
    }

    const handleLeave = async () => {

        await onLeave(id);
    }


    return (
        <MatchCard className={`w-full p-5! gap-5! md:flex-row md:items-center ${className ?? ''}`}>
            <div className="flex items-center gap-4 md:w-[35%] min-w-0">
                <div className="w-14 h-14 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                    <Icon size={35} className="text-primary" />
                </div>

                <div className="min-w-0">
                    <p className="text-sm font-bold text-secondary truncate">{title}</p>
                    <p className="text-xsm text-secondary/60 captilize">{match_mode}</p>
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="flex justify-between text-xsm text-secondary/60 uppercase">
                    <span>Capacity: {player_count} Players</span>
                    <span>Minimum: {min_players} Players</span>
                </div>
                <Progress value={progress} className="w-full h-2" />
            </div>

            <div className="flex flex-row md:flex-col gap-2 md:w-48 shrink-0">
                {is_host && (
                    <Button
                        onClick={async () => { await nav(`/tournaments/waiting/${id}`) }}
                        className="w-[12rem] h-[2.25rem] my-auto rounded-[11px]"
                        variant={"default"}
                    >
                        <div className="flex flex-row w-full h-full gap-5 text-[1rem] justify-between items-center">
                                View Lobby
                                <ArrowRight size={25} className="flex justify-self-end my-auto -ml-9 mr-2" />
                            </div>
                    </Button>
                )}

                {joined && !is_host && (
                    <div className='flex flex-col'>
                        <Button
                            onClick={handleLeave}
                            className="w-[12rem] h-[2.25rem] my-auto rounded-[11px]"
                            variant={"default"}
                        >
                            <div className="flex flex-row w-full h-full gap-5 text-[1rem] justify-between items-center">
                                Leave
                                <X size={25} className="flex justify-self-end my-auto -ml-9 mr-2" />

                            </div>
                        </Button>

                        <Button
                            onClick={async () => { await nav(`/tournaments/waiting/${id}`) }}
                            className="w-[12rem] h-[2.25rem] my-auto rounded-[11px]"
                            variant={"default"}
                        >
                            <div className="flex flex-row w-full h-full gap-5 text-[1rem] justify-between items-center">
                                View Lobby
                                <ArrowRight size={25} className="flex justify-self-end my-auto -ml-9 mr-2" />
                            </div>
                        </Button>
                    </div>

                )}

                {!joined && (
                    <Button
                        onClick={handleJoin}
                        className="w-[12rem] h-[2.25rem] my-auto rounded-[11px]"
                        variant={"default"}
                    >
                        <div className="flex flex-row w-full h-full gap-5 text-[1rem] justify-between items-center">
                            Join Tournament
                            <ArrowRight size={25} className="flex justify-self-end my-auto -ml-9 mr-2" />
                        </div>
                    </Button>
                )}
            </div>
            
            {children}
        </MatchCard>
    )
}