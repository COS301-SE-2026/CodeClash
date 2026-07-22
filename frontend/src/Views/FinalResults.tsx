import React from "react";
import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";
import type {FinalResultsViewModelProps} from "../ViewModels/FinalResultsViewModel";
import type { PlayerFinalResults } from "../Models/FinalResultsModel";

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
        </div>
    );
};

export default FinalResults;