import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";
import { type PlayerResultDTO, type ResultDTO } from "src/dtos/match/result.dto";

import { finalResultsContent } from "../Models/FinalResultsModel";
import type { FinalResultsContent } from "../Models/FinalResultsModel";



interface FinalResultsViewModel {
    content: FinalResultsContent;
    state: 'loading' | 'results' | 'error';
    loadingProgress: number; //for user to see how far the loading is
    winner: PlayerResultDTO | null,
    loser: PlayerResultDTO | null

}

export function FinalResultsViewModelFunction(): FinalResultsViewModel {
    const [state, setState] = useState<'loading' | 'results' | 'error'>('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [results, setResults] = useState<ResultDTO | null>(null);
    const [winner, setWinner] = useState<PlayerResultDTO | null>(null);
    const [loser, setLoser] = useState<PlayerResultDTO | null>(null);
    const { refresh } = useUser();
    const { match_socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;
    const { pairId, setMatched } = useMatchmaking()

    const handleResult = useCallback(async (result: ResultDTO) => {

        setResults(result);

        setWinner(result.result.players[0]);
        setLoser(result.result.players[1]);
        await refresh();

        // can start clean up now 
        match_socket?.cleanUpMatch({ match_id: result.match_id, pair_id: pairId })
        setMatched(false)
    }, [pairId, refresh, setMatched, match_socket])


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

        if (!match_socket) return;

        match_socket.sendResults({ match_id: id, pair_id: pairId });
        const clean_up = match_socket.getResults(handleResult);



        return () => { clean_up(); }

    }, [match_socket, id, handleResult, pairId]);

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
        winner,
        loser
    };
}