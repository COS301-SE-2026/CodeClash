import { useState, useEffect, useCallback } from "react";
import { finalResultsContent } from "../Models/FinalResultsModel";
import type { FinalResults, FinalResultsContent } from "../Models/FinalResultsModel";

interface FinalResultsViewModelProps {
    onPlayAgain: () => void;
    onReturn: () => void;
    fetchResults: () => Promise<FinalResults[]>; //results will be passed here once calculated
}

interface FinalResultsViewModel {
    content: FinalResults;
    state: 'loading' | 'results';
    loadingProgress: number; //for user to see how far the loading is
    diaplayError: string | null;
    handlePlayAgain: () => void;
    handleReturn: () => void;
}