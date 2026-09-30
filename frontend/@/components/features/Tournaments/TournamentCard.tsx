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
        console.log("joining...")
        await onJoin(id);
    }

    const handleLeave = async () => {
        console.log("leaving")
        await onLeave(id);
    }


    return (
        <MatchCard className={`flex flex-row justify-between w-[95%] relative  ${className} overflow-x-auto`}>
            <div>

                <div className="flex flex-col max-w-full h-full">
                    <div className="flex flex-col">
                        <Icon size={50} className="ml-5 my-auto" />
                    </div>
                    <div className="font-font font-semibold text-[1.5rem]">
                        {title}
                    </div>
                </div>
            </div>

            <div>
                <div className="flex flex-col ml-auto mr-5">
                    <div className="flex flex-row mt-1.5 w-[140%]">
                        <div className=" text-xs text-muted-text uppercase">Capacity: {player_count}/{min_players} Players</div>
                    </div>
                    <Progress value={progress} className="mt-2 w-[130%] h-[0.5rem]" />
                    <div className=" text-xs text-muted-text ">{Math.max(0, min_players - player_count)} Available slots</div>
                </div>


            </div>

            {is_host ? (

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

            ) : joined ? (
                <div>
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
                </div>

            ) : (
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
            )

            }

            {children}
        </MatchCard>
    )
}