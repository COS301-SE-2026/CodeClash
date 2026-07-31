import { useState, useEffect} from "react";
import { finalResultsContent } from "../Models/FinalResultsModel";
import type { PlayerFinalResults, FinalResultsContent } from "../Models/FinalResultsModel";

async function fetchResults(): Promise<PlayerFinalResults[]> {
    //add the actual api call 
    throw new Error('Results not ready');
}

interface FinalResultsViewModel {
    content: FinalResultsContent;
    state: 'loading' | 'results' | 'error';
    loadingProgress: number; //for user to see how far the loading is
    results: PlayerFinalResults[];
}

export function FinalResultsViewModelFunction(): FinalResultsViewModel {
    const [state, setState] = useState< 'loading' | 'results' | 'error'>('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [results, setResults] = useState<PlayerFinalResults[]>([]);

    useEffect(() => {
        let progressInterval: ReturnType<typeof setInterval>;
        let cancelled = false;

        progressInterval = setInterval(() => { //create a fake loading animation that will gradually fill while waiting for backed. This is going to cont to UX cause otherwise they will just see a frozen loading screen
            setLoadingProgress(prev => {
                if (prev >= 90) { //this will have the bar slow down as it reaches 90% and wait for real data. This can be changed as it gets connected to backend
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 5; //this will make the loading bar feel more natural instead of updating by the same amount the same time
            });
        }, 400);

        fetchResults().then(data => { //REPLACE WITH REAL API CALL
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
            setState('error'); //so the error will ask the user to come back later
        });

        return () => {
            cancelled = true;
            clearInterval(progressInterval);
        };
    }, []);

    return {
        content: finalResultsContent,
        state,
        loadingProgress,
        results,
    };
}