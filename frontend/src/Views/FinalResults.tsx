import React from "react";
import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";
import type {FinalResultsViewModelProps} from "../ViewModels/FinalResultsViewModel";
import type { PlayerFinalResults } from "../Models/FinalResultsModel";
import { TrendingUp, TrendingDown,} from "lucide-react";

const FinalResults: React.FC<FinalResultsViewModelProps> = ({onPlayAgain, onReturn, fetchResults}) => {
    const {
        content, state, loadingProgress,
        results, displayError, 
        handlePlayAgain, handleReturn,
    } = FinalResultsViewModelFunction({onPlayAgain, onReturn, fetchResults});

    return (
        <div className="bg-secondary min-h-screen w-full flex items-center justify-center">
            
            {state === 'loading' && (
                <div className="bg-secondary rounded-3xl p-12 w-[90%] max-w-[550px] flex flex-col gap-6">
                    <h1 className="text-secondary-text font-bold"
                        style = {{fontSize: 'var(--heading-size)'}}>{content.titleLoading}</h1>
                    
                    {displayError ? (
                        <p className="text-danger">{displayError}</p>
                    ) : (
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center">
                                <span className="text-secondary-text font-medium"
                                    style = {{fontSize: 'var(--font-size-sm)'}}>
                                    {content.labelLoading}
                                </span>
                                <span className="text-secondary-text font-bold"
                                    style = {{fontSize: 'var(--font-size-sm)'}}>
                                    {Math.min(Math.round(loadingProgress), 100)}%
                                </span>
                            </div>

                            <div className="w-full h-8 border-2 border-secondary-text rounded-sm overflow-hidden">
                                <div className="h-full bg-secondary-text transition-all duration-500 ease-out"
                                    style = {{width: `${Math.min(loadingProgress, 100)}%`}}/>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {state === 'results' && (
                <div className="bg-secondary rounded-3xl p-10 w-[90%] max-w-[7200px] flex flex-col gap-6">
                    <h1 className="text-secondary-text font-bold text-center"
                        style = {{fontSize: 'var(--heading-size)'}}>{content.titleResults}</h1>

                    {/*Table of results */}
                    <div className="border border-secondary-text rounded-xl overflow-hidden">
                        {/*Header */}
                        <div className="grid border-b border-secondary-text"
                            style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'}}>
                            {content.tableHeaders.map(header => (
                                <div key={header} className="px-3 py-3 text-center border-r border-secondary-text last:border-r-0">
                                    <span className="text-secondary-text font-bold"
                                        style = {{fontSize: 'var(--font-size-xsm)'}}>{header}</span>
                                </div>
                            ))}
                        </div>

                        {/*Rows */}
                        {results.map((player, i) => (
                            <div key = {player.username} className= {`grid items-stretch items-center ${i < results.length-1 ? 'border-b border-secondary-text' : ''}`}
                                style = {{gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr'}}>
                                
                                {/*The user name + user robot/icon */}
                                <div className="px-3 py-4 flex flex-col items-center justify-center gap-1 border-r border-secondary-text h-full">
                                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        {player.avatar ? (
                                            <img src = {player.avatar} className="w-full h-full object-cover"/>
                                        ): (
                                            <div className="w-full h-full bg-secondary-text"/>
                                        )}
                                    </div>
                                    <span className="text-secondary-text font-medium text-center truncate w-full"
                                        style={{ fontSize: 'var(--font-size-xsm)'}}>{player.username}</span>
                                </div>

                                {/*The column for correctness */}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{fontSize: 'var(--font-size-sm)'}}>{player.correctness}%</span>
                                </div>

                                {/*The column for speed - copied from above*/}
                                <div className="px-3 py-4 flex items-center justify-center border-r border-secondary-text h-full">
                                    <span className="text-secondary-text font-semibold"
                                        style={{fontSize: 'var(--font-size-sm)'}}>{player.speed}</span>
                                </div>

                                {/*Column for elo effect */}
                                <div className="px-3 py-4 flex  flex-col items-center justify-center border-r border-secondary-text h-full">
                                    {player.eloEffect >= 0 ? (
                                        <TrendingUp className="w-9 h-9 text-success"/>
                                    ): (
                                        <TrendingDown className="w-9 h-9 text-danger"/>
                                    )}
                                    <span className= {`font-bold ${player.eloEffect >=0 ? 'text-success': 'text-danger'}`}
                                        style={{fontSize: 'var(--font-size-sm)'}}>{player.eloEffect >= 0 ? ' +': ''}{player.eloEffect}</span>
                                </div>

                                {/*Column for the users position (1st or 2nd) */}
                                <div className="px-3 py-4 mt-2">
                                    <Badge position={ player.position}/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

const Badge: React.FC<{position: 1 | 2}> = ({position}) => {
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