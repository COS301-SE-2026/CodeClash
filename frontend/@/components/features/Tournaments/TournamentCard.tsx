import React, { useEffect, useState } from 'react'
import { Calculator, Timer, ArrowRight, CodeXml } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { MatchCard } from '@/components/ui/MatchCard'
import { useNavigate } from 'react-router-dom'
import type { MatchMode } from 'src/dtos/match/match.dto'
import { Button } from '@/components/ui/button'

interface TournamentCardProps {
    match_mode: MatchMode,
    children?: React.ReactNode
    className?: string,
    title: string,
    min_players: number,
    player_count: number,
    start_date: Date
}

//Any copied and pasted code below was all hand-written and pasted for the sake of saving time, ai did not generate this code

export const TournamentCard = ({
    match_mode,
    children,
    className,
    title,
    min_players,
    player_count,
    start_date
}: TournamentCardProps) => {

    const starts_in = () => {
        const diff_ms = start_date.getTime() - Date.now();

        if (diff_ms <= 0) return "NOW";

        const total_seconds = Math.floor(diff_ms / 1000);
        const days = Math.floor(total_seconds / 86400);
        const hours = Math.floor((total_seconds % 86400) / 3600);
        const minutes = Math.floor((total_seconds & 3600) / 60);
        const seconds = total_seconds % 60;

        let time = "";

        if (days > 0) time += `${days}d `;
        if (hours > 0) time += `${hours}h `;
        if (minutes > 0) time += `${minutes}m `;
        if (seconds > 0) time += `${seconds}s`;

        return time;
    }

    const nav = useNavigate();
    const Icon = match_mode === 'math' ? Calculator : CodeXml;
    const progress = (player_count / min_players) * 100;
    const [countdown, setCountdown] = useState(() => starts_in());

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(starts_in());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <MatchCard className={`flex flex-row w-[95%] relative  ${className} overflow-x-auto`}>
            <div>

                <div className="flex flex-col max-w-full h-full">
                    <div className="flex flex-col">
                        <Icon size={50} className="ml-5 my-auto" />
                    </div>
                    <div className="font-font font-semibold text-[1.5rem]">
                        {title}
                    </div>

                    <div className="flex flex-row gap-2">
                        <Timer size={20} className="text-muted-text my-auto" />
                        <div className="font-font text-xs my-auto text-muted-text mt-0.5">Starts in {countdown} </div>
                    </div>

                </div>
            </div>

            <div>
                <div className="flex flex-col ml-auto mr-5">
                    <div className="flex flex-row mt-1.5 w-[140%]">
                        <div className="font-font text-xs text-primary ">Capacity: {player_count}/{min_players} Players</div>
                    </div>
                    <Progress value={progress} className="mt-2 w-[130%] h-[0.5rem]" />
                    <div>{min_players - player_count} Available slots</div>
                </div>

                <Button
                    onClick={() => nav('/tournaments/waiting')}
                    className="w-[9rem] h-[2.25rem] my-auto rounded-[11px] ml-auto mr-10"
                    variant={"default"}
                >
                    <div className="flex flex-row w-full h-full gap-5">
                        <h2 className="font-font text-xs font-semibold w-[120%] my-auto">Join Tournament</h2>
                        <ArrowRight size={25} className="flex justify-self-end my-auto -ml-9 mr-2" />
                    </div>
                </Button>
            </div>

            {children}
        </MatchCard>
    )
}