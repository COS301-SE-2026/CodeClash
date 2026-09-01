import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";
import { robot_map } from "src/assets/Robots";
import Loading from "@/components/shared/Loading";
import Starfield from "@/components/ui/animations/Starfield";
import Confetti from "@/components/ui/animations/Confetti";

const FinalResults: React.FC = () => {
    const navigate = useNavigate();

    const {
        content, state, loadingProgress,
        winner, loser
    } = FinalResultsViewModelFunction();

    const formatTime = (ms: number|undefined) => {

        if(ms === undefined) return 'Error getting time'
        const total_sec = Math.floor(ms / 1000);
        const min = Math.floor(total_sec / 60);
        const sec = total_sec % 60

        return `${min}:${sec.toString().padStart(2,'0')}`;
    }

    if(!winner || !loser){
        return(
            <Loading></Loading>
        )
    }

    const [res, setRes] = useState(false);
    useEffect(() => {
        if (state !== 'results') {
            setRes(false);
            return;
        }
        const anim = requestAnimationFrame(() => setRes(true));
        return () => cancelAnimationFrame(anim);
    }, [state]);

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
                    <div className="w-[90%] max-w-6xl flex flex-col gap-6 p-10">
                        <h1 className="text-primary-text font-bold text-center"
                            style={{ fontSize: 'var(--heading-size)' }}>{content.titleResults}</h1>

                        {/*Table of results */}
                        <div className="flex flex-col gap-4">
                            {/*Header */}
                            <div className="grid rounded-lg border border-secondary-text bg-secondary"
                                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>
                                {content.tableHeaders.map(header => (
                                    <div key={header} className="px-3 py-3 text-center border-r border-secondary-text last:border-r-0">
                                        <span className="text-secondary-text font-bold"
                                            style={{ fontSize: 'var(--font-size-xsm)' }}>{header}</span>
                                    </div>
                                ))}
                            </div>

                            {/*Rows */}

                            {/* winner */}

                            <div className="grid rounded-lg border border-secondary-text bg-secondary"
                                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>

                                {/*The user name + user robot/icon */}
                                <div className="px-3 py-4 flex flex-col items-center justify-center gap-1 border-r border-secondary-text h-full">
                                    <div className="w-15 h-[6rem] rounded-full overflow-hidden flex-shrink-0">
                                        {winner ? (
                                            <img src={robot_map[winner.avatar]} alt={winner.username} className="w-full h-[5.5rem]  object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary-text" />
                                        )}
                                    </div>
                                    <span className="text-secondary-text font-medium text-center truncate w-full"
                                        style={{ fontSize: 'var(--font-size-xsm)' }}>{winner.username}</span>
                                </div>

                                {/*The column for correctness */}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{winner.correctness} questions</span>
                                </div>

                                {/*The column for speed - copied from above*/}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{formatTime(winner.speed)}</span>
                                </div>

                                {/*Column for elo effect */}
                                <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                    {winner.eloEffect >= 0 ? (
                                        <TrendingUp className="w-9 h-9 text-success" />
                                    ) : (
                                        <TrendingDown className="w-9 h-9 text-danger" />
                                    )}
                                    <span className={`font-bold ${winner.eloEffect >= 0 ? 'text-success' : 'text-danger'}`}
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{winner.eloEffect}</span>
                                </div>

                                {/*Column for the users position (1st or 2nd) */}
                                <div className="px-3 py-4 mt-2">
                                    <Badge position={1} />
                                </div>
                            </div>

                        </div>

                        {/* loser */}

                        <div className="grid rounded-lg border border-secondary-text bg-secondary"
                            style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr' }}>

                            {/*The user name + user robot/icon */}
                            <div className="px-3 py-4 flex flex-col items-center justify-center gap-1 border-r border-secondary-text h-full">
                                <div className="w-15 h-25 rounded-full overflow-hidden flex-shrink-0">
                                    {loser ? (
                                            <img src={robot_map[loser.avatar]} alt={loser.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary-text" />
                                        )}
                                </div>
                                <span className="text-secondary-text font-medium text-center truncate w-full"
                                    style={{ fontSize: 'var(--font-size-xsm)' }}>{loser.username}</span>
                            </div>

                            {/*The column for correctness */}
                            <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                <span className="text-secondary-text font-semibold"
                                    style={{ fontSize: 'var(--font-size-sm)' }}>{loser.correctness} questions</span>
                            </div>

                            {/*The column for speed - copied from above*/}
                            <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                <span className="text-secondary-text font-semibold"
                                    style={{ fontSize: 'var(--font-size-sm)' }}>{formatTime(loser.speed)}</span>
                            </div>

                            {/*Column for elo effect */}
                            <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                {loser.eloEffect >= 0 ? (
                                    <TrendingUp className="w-9 h-9 text-success" />
                                ) : (
                                    <TrendingDown className="w-9 h-9 text-danger" />
                                )}
                                <span className={`font-bold ${loser.eloEffect >= 0 ? 'text-success' : 'text-danger'}`}
                                    style={{ fontSize: 'var(--font-size-sm)' }}>{loser.eloEffect}</span>
                            </div>

                            {/*Column for the users position (1st or 2nd) */}
                            <div className="px-3 py-4 mt-2">
                                <Badge position={2} />
                            </div>
                        </div>


                        {/*Buttons for return and try again*/}
                        <div className="flex gap-4 mt-2">
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
                </div>
            )}
        </div>
    );
};

const Badge: React.FC<{ position: 1 | 2 }> = ({ position }) => {
    if (position === 1) return (
        <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center shadow-md">
                <span className="text-yellow-900 font-black text-xs">1st</span>
            </div>
        </div>
    );
    return (
        <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full bg-gray-400 border-4 border-gray-600 flex items-center justify-center shadow-md">
                <span className="text-gray-700 font-black text-xs">2nd</span>
            </div>
        </div>
    );
};

export default FinalResults;