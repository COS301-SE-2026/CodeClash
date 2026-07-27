import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

import ResultsBackground from '../assets/Background/FinalResults.jpg';
import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";


const FinalResults: React.FC = () => {
    const navigate = useNavigate();

    const {
        content, state, loadingProgress,
        results,
    } = FinalResultsViewModelFunction();


    console.log(results)

    const winner_stats = results?.stats[results.winner.id];
    const loser_stats = results?.stats[results.loser.id]
    return (
        <div className="bg-secondary min-h-screen w-full flex items-center justify-center">

            {state === 'loading' && (
                <div className="bg-secondary rounded-3xl p-12 w-[90%] max-w-[550px] flex flex-col gap-6">
                    <h1 className="text-secondary-text font-bold"
                        style={{ fontSize: 'var(--heading-size)' }}>{content.titleLoading}</h1>

                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center">
                            <span className="text-secondary-text font-medium"
                                style={{ fontSize: 'var(--font-size-sm)' }}>
                                {content.labelLoading}
                            </span>
                            <span className="text-secondary-text font-bold"
                                style={{ fontSize: 'var(--font-size-sm)' }}>
                                {Math.min(Math.round(loadingProgress), 100)}%
                            </span>
                        </div>

                        <div className="w-full h-8 border-2 border-secondary-text rounded-sm overflow-hidden">
                            <div className="h-full bg-secondary-text transition-all duration-500 ease-out"
                                style={{ width: `${Math.min(loadingProgress, 100)}%` }} />
                        </div>
                    </div>
                </div>
            )}

            {/*Error state */}
            {state === 'error' && (
                <div className="bg-secondary rounded-3xl p-12 w-[90%] max-w-[550px] flex flex-col items-center gap-6 text-center">
                    <Clock className="w-16 h-16 text-black opacity-60" />
                    <h1 className="text-secondary-text font-extrabold"
                        style={{ fontSize: 'var(--heading-size)' }}>{content.titleError}</h1>
                    <p className="text-secondary-text iopacity-70 leading-relaxed"
                        style={{ fontSize: 'var(--font-size-sm)' }}>{content.messageError}</p>
                    <button className="w-full py-3 rounded-2xl bg-button-primary text-button-text-primary font-bold hover:opacity-90 transition-opacity shadow-badge flex items-center justify-center gap-2"
                        style={{ fontSize: 'var(--font-size-sm)' }} onClick={() => navigate('/dashboard')} type="button">
                        {content.labelReturn}
                    </button>
                </div>
            )}

            {state === 'results' && (
                <div className="min-h-screen w-full flex items-center justify-center"
                    style={{ backgroundImage: `url(${ResultsBackground})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', }}>
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
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        {/* {.avatar ? (
                                            <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary-text" />
                                        )} */}
                                    </div>
                                    <span className="text-secondary-text font-medium text-center truncate w-full"
                                        style={{ fontSize: 'var(--font-size-xsm)' }}>{results?.winner.username}</span>
                                </div>

                                {/*The column for correctness */}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{winner_stats?.num_correct} questions correct</span>
                                </div>

                                {/*The column for speed - copied from above*/}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{winner_stats?.total_time}</span>
                                </div>

                                {/*Column for elo effect */}
                                <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                    {results?.winner.elo! >= 0 ? (
                                        <TrendingUp className="w-9 h-9 text-success" />
                                    ) : (
                                        <TrendingDown className="w-9 h-9 text-danger" />
                                    )}
                                    <span className={`font-bold ${results?.winner.elo! >= 0 ? 'text-success' : 'text-danger'}`}
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{results?.winner.elo!}</span>
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
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        {/* {.avatar ? (
                                            <img src={player.avatar} alt={player.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-secondary-text" />
                                        )} */}
                                    </div>
                                    <span className="text-secondary-text font-medium text-center truncate w-full"
                                        style={{ fontSize: 'var(--font-size-xsm)' }}>{results?.loser.username}</span>
                                </div>

                                {/*The column for correctness */}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{loser_stats?.num_correct} questions correct</span>
                                </div>

                                {/*The column for speed - copied from above*/}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{loser_stats?.total_time}</span>
                                </div>

                                {/*Column for elo effect */}
                                <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                    {results?.loser.elo! >= 0 ? (
                                        <TrendingUp className="w-9 h-9 text-success" />
                                    ) : (
                                        <TrendingDown className="w-9 h-9 text-danger" />
                                    )}
                                    <span className={`font-bold ${results?.loser.elo! >= 0 ? 'text-success' : 'text-danger'}`}
                                        style={{ fontSize: 'var(--font-size-sm)' }}>{results?.loser.elo!}</span>
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