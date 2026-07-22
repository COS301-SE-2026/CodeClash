import React from "react";
import { FinalResultsViewModelFunction } from "../ViewModels/FinalResultsViewModel";
import type {FinalResultsViewModelProps} from "../ViewModels/FinalResultsViewModel";
import type { PlayerFinalResults } from "../Models/FinalResultsModel";

const FinalResults: React.FC<FinalResultsViewModelProps> = ({onPlayAgain, onReturn, fetchResults}) => {
    const {
        contet, state, loadingProgress,
        results, displayError, 
        handlePlayAgain, handleReturn,
    } = FinalResultsViewModelFunction({onPlayAgain, onReturn, fetchResults});

    return (
        <div>
            
        </div>
    );
};

export default FinalResults;