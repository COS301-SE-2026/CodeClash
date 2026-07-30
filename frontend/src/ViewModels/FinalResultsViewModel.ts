import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { ResultDTO } from "src/dtos/result.dto";

import { finalResultsContent } from "../Models/FinalResultsModel";
import type { FinalResultsContent } from "../Models/FinalResultsModel";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";

interface FinalResultsViewModel {
    content: FinalResultsContent;
    state: 'loading' | 'results' | 'error';
    loadingProgress: number; //for user to see how far the loading is
    results: ResultDTO | null;

}

export function FinalResultsViewModelFunction(): FinalResultsViewModel {
    const [state, setState] = useState<'loading' | 'results' | 'error'>('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [results, setResults] = useState<ResultDTO | null>(null);
    const { socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;
    const {pairId} = useMatchmaking()

    const handleResult = (result: ResultDTO) => {
        setResults(result);
    }


    useEffect(() => {
        if (results !== null) return;

        const progressInterval = setInterval(() => { //create a fake loading animation that will gradually fill while waiting for backed. This is going to cont to UX cause otherwise they will just see a frozen loading screen
            setLoadingProgress(prev => {
                if (prev >= 90) { //this will have the bar slow down as it reaches 90% and wait for real data. This can be changed as it gets connected to backend
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 5; //this will make the loading bar feel more natural instead of updating by the same amount the same time
            });
        }, 400);
    }, [results])

    useEffect(() => {

        if (!socket) return;

        socket.emit('send_results', id, pairId);
        socket.on('get_result', handleResult);


        return () => {
            socket.off('get_result', handleResult)
        };

    }, [socket, id]);

    useEffect(() => {
        if (results === null) return;

        setLoadingProgress(100);

        const timeout = setTimeout(() => {
            setState('results')
        }, 600);

        return () => {
            clearTimeout(timeout)
        }
    }, [results]);

    return {
        content: finalResultsContent,
        state,
        loadingProgress,
        results,
    };
}