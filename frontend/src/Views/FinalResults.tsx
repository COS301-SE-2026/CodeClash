import { TrendingUp, TrendingDown, Minus, Clock, UserCircle, Trophy, Medal } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { robot_map } from "src/assets/Robots";
import type { PlayerFinalResults } from "src/Models/FinalResultsModel";

import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";

import Loading from "@/components/shared/Loading";
import Confetti from "@/components/ui/animations/Confetti";
import Starfield from "@/components/ui/animations/Starfield";

const FinalResults: React.FC = () => {
    const navigate = useNavigate();

    const {
        content, state, loadingProgress,
        winner, loser
    } = FinalResultsViewModelFunction();

    const [res, setRes] = useState(false); // moved

    useEffect(() => {
        if (state !== 'results') {
            setRes(false);
            return;
        }
        const anim = requestAnimationFrame(() => setRes(true));
        return () => cancelAnimationFrame(anim);
    }, [state]);

    const formatTime = (ms: number|undefined) => {

        if(ms === undefined) return 'Error getting time'
        const total_sec = Math.floor(ms / 1000);
        const min = Math.floor(total_sec / 60);
        const sec = total_sec % 60

        return `${min}:${sec.toString().padStart(2,'0')}`;
    }

    if(!winner || !loser){
        return(
            <Loading />
        )
    }

    return (
        <div className="bg-background min-h-screen w-full flex items-center justify-center">
            <div className="absolute inset-0 transition-opacity duration-700 ease-out pointer-events-none"
                style={{opacity: res ? 1:0, background: 'radial-gradient(circle at 50% 15%, #b91551 0%, #850f3b 22%, #630b3c 34%, #0a0008 62%'}}>
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background"/>
                <div style={{position: 'absolute', width: 420, height: 420, top: '5%', left: '-8%', background: 'var(--primary)', borderRadius: '9999px', filter: 'blur(70px), opacity: 0.45'}}/>
                <div style={{position: 'absolute', width: 320, height: 320, bottom: '0%', right: '-6%', background: 'var(--color-pink-300)', borderRadius: '9999px', filter: 'blur(70px)', opacity: 0.45}}/>
                {state === 'results' && <Starfield count={60}/>}
            </div>
            {state === 'results' && <Confetti count={35}/>}

            {state === 'loading' && (
                <div className="p-5 w-full max-w-[550px] flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-primary-text font-medium"
                                style={{ fontSize: 'var(--font-size-sm)' }}>
                                {content.labelLoading}
                            </span>
                            <span className="score-display text-primary-text text-md">
                                {Math.min(Math.round(loadingProgress), 100)}%
                            </span>
                        </div>

                        <div className="progress-track h-4">
                            <div className="progress-fill"
                                style={{ width: `${Math.min(loadingProgress, 100)}%` }} />
                        </div>
                    </div>
                </div>
            )}

            {/*Error state */}
            {state === 'error' && (
                <div className="p-12 w-full max-w-[550px] flex flex-col items-center gap-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center">
                        <Clock className="w-8 h-8 text-danger"/>
                    </div>
                    <p className="text-primary-text leading-relaxed whitespace-nowrap"
                        style={{ fontSize: 'var(--font-size-sm)' }}>{content.messageError}</p>
                    <button className="w-full btn btn-primary"
                        style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button">
                        {content.labelReturn}
                    </button>
                </div>
            )}

            {state === 'results' && (
                <div className="relative z-10 w-full max-w-2xl flex flex-col gap-4 p-6">
                        <h1 className="text-primary-text font-bold text-center text-xl">{content.titleResults}</h1>

                        {/*Table of results */}
                        <div className="flex flex-col gap-4">
                            <PlayerResultCard player={{
                                username: winner.username, avatar: winner.avatar,
                                correctness: winner.correctness, speed: formatTime(winner.speed),
                                eloEffect: winner.eloEffect, position: 1
                                }}
                                emphasize
                            />
                            {/*copied from above and mod for loser */}
                            <PlayerResultCard player={{
                                username: loser.username, avatar: loser.avatar,
                                correctness: loser.correctness, speed: formatTime(loser.speed),
                                eloEffect: loser.eloEffect, position: 2
                                }}
                            />
                        </div>

                        {/*Buttons for return and try again*/}
                        <div className="flex gap-3 mt-1">
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-secondary text-secondary-text font-bold hover:opacity-80 transition-opacity"
                                style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button">
                                {content.labelReturn}
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-button-primary text-button-text-primary font-bold hover:opacity-90 transition-opacity"
                                style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button"> {/*Need to fix this navigation cause not sure where this will take the user?? */}
                                {content.labelPlayAgain}
                            </button>
                        </div>
                    </div>
            )}
        </div>
    );
};

const PlayerResultCard: React.FC<{
    player: PlayerFinalResults;
    emphasize?: boolean; //emphasis on the winners card, so its somewhat more visible and different to loser card
}> = ({player, emphasize}) => {
    const [avatarFailed, setAvatarFailed] = useState(false);
    return (
        <div className={`${emphasize? 'card-glow' : 'card-elevated'} p-4 flex flex-col sm:flex-row items-center gap-4`}>
            <div className="flex flex-col items-center gap-1 shrink-0 w-20">
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary flex items-center justify-center bg-card">
                    {avatarFailed ? (
                        <UserCircle size={26} className="text-muted-text"/>
                    ): (
                        <img src={robot_map[player.avatar]} alt = {player.username} className="w-full h-full object-cover" onError={() => setAvatarFailed(true)}/>
                    )}
                </div>
                <span className="text-primary-text font-semibold text-center truncate w-full text-xs">{player.username}</span>
            </div>

            <div className="grid grid-cols-4 gap-2 flex-1 w-full">
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xsm uppercase tracking-wide text-muted">Correctness</span>
                    <span className="score-display text-base text-primary-text">{player.correctness}</span>
                </div>
                {/*Copied from above and modified */}
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xsm uppercase tracking-wide text-muted">Time</span>
                    <span className="score-display text-base text-primary-text">{player.speed}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xsm uppercase tracking-wide text-muted">ELO</span>
                    <span className={`flex items-center gap-1 text-sm font-bold ${player.eloEffect >= 0 ? 'text-success' : 'text-danger'}`}>
                        {player.eloEffect >= 0 ? (
                            <TrendingUp size={16}/>
                        ): (
                            <TrendingDown size={16}/>
                        )}
                        {player.eloEffect}
                    </span>
                </div>
                {/*Copied from above and modified */}
                <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xsm uppercase tracking-wide text-muted">Position</span>
                    <span className="flex items-center gap-1 text-sm font-bold">
                        {player.position === 1 ? 
                            <Trophy size={16}/> : <Medal size={16}/>
                        }
                        {player.position === 1 ? '1st': '2nd'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default FinalResults;