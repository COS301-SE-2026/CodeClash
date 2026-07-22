import { useState, useEffect, useCallback } from "react";
import { finalResultsContent } from "../Models/FinalResultsModel";
import type { FinalResults, FinalResultsContent } from "../Models/FinalResultsModel";

interface FinalResultsViewModelProps {
    onPlayAgain: () => void;
    onReturn: () => void;
    fetchResults: () => Promise<FinalResults[]>; //results will be passed here once calculated
}

interface FinalResultsViewModel {
    content: FinalResultsContent;
    state: 'loading' | 'results';
    loadingProgress: number; //for user to see how far the loading is
    results: FinalResults[];
    displayError: string | null;
    handlePlayAgain: () => void;
    handleReturn: () => void;
}

export function FinalResultsViewModelFunction ({
    onPlayAgain, onReturn, fetchResults,
}: FinalResultsViewModelProps): FinalResultsViewModel {
    const [state, setState] = useState< 'loading' | 'results'>('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [results, setResults] = useState<FinalResults[]>([]);
    const [displayError, setDisplayError] = useState<string | null>(null);

    useEffect(() => {
        let progressInterval: ReturnType<typeof setInterval>;
        let cancelled = false;

        progressInterval = setInterval(() => { //create a fake loading animation that will gradually fill while waiting for backed. This is going to cont to UX cause otherwise they will just see a frozen loading screen
            setLoadingProgress(prev => {
                if (prev >= 90) { //this will have the bar slow down as it reaches 90% and wait for real data. This can be changed as it gets connected to backend
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + Math.random() * 8; //this will make the loading bar feel more natural instead of updating by the same amount the same time
            });
        }, 400);

        fetchResults().then(data => {
            if (cancelled) return;
            clearInterval(progressInterval);
            setLoadingProgress(100);

            setTimeout(() => { //brief pause before displaying results
                if (!cancelled) {
                    setResults(data);
                    setState('results');
                }
            }, 600)
        }).catch(() => {
            if (cancelled) return;
            clearInterval(progressInterval);
            setDisplayError('Failed to load results.'); //how are we going about 'trying again' in case of failure? i could add a Retry button
        });

        return () => {
            cancelled = true;
            clearInterval(progressInterval);
        };
    }, [fetchResults]);

    const handlePlayAgain = useCallback(() => onPlayAgain(), [onPlayAgain]);
    const handleReturn = useCallback(() => onReturn(), [onReturn]);

    return {
        content: finalResultsContent,
        state,
        loadingProgress,
        results,
        displayError,
        handlePlayAgain,
        handleReturn,
    }
}