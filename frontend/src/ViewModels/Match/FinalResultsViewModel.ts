import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { type PlayerResultDTO, } from "src/dtos/match/result.dto";

import { finalResultsContent } from "src/Models/FinalResultsModel";
import type { FinalResultsContent } from "src/Models/FinalResultsModel";
import { useMatchStore } from "src/stores/match-store";
import { useResultStore } from "src/stores/result-store";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { getEquippedFor } from "src/services/shop.service";



interface FinalResultsViewModel {
    content: FinalResultsContent;
    state: 'loading' | 'results' | 'error';
    loadingProgress: number; //for user to see how far the loading is
    winner: PlayerResultDTO | null,
    loser: PlayerResultDTO | null,
    avatarImageWinner: string | null,
    avatarImageLoser: string | null

}

export function FinalResultsViewModelFunction(): FinalResultsViewModel {
    const [state, setState] = useState<'loading' | 'results' | 'error'>('loading');
    const [loadingProgress, setLoadingProgress] = useState(0);
    const { match_id } = useParams();
    const { matchSocket } = useSocket();
    const { group_id } = useMatchmaking();
    const results = useResultStore(s => s.results.find(r => r?.match_id === match_id));
    const {token} = useAuth();
    const tokenInv = token ?? "";

    const winner = useMemo(() => results?.players.find(p => p.position === 1) ?? null, [results]);
  const loser = useMemo(() => results?.players.find(p => p.position === 2) ?? null, [results]);

    useEffect(() => {
        if (useMatchStore.getState().match_id === match_id) useMatchStore.getState().reset();
    }, [results])

    const [avatarImageWinner, setAvatarImageWinner] = useState<string | null>(null);
    const [avatarImageLoser, setAvatarImageLoser] = useState<string | null>(null);

    useEffect(() => {
        if (!tokenInv){
            return;
        }

        //the following code block was written by hand just pasted because it was in the wrong place
        const cropAvatar = (url: string | undefined): string | null => {
                
                if (!url) {
                    return null;
                }

                return url.replace("src/assets/Shop/Avatars", "").replace(".png", "");
                
            }

        const loadAvatars = async () => {
            const [winnerRes, loserRes] = await Promise.all([
                getEquippedFor(winner?.user_id ?? "", tokenInv),
                getEquippedFor(loser?.user_id ?? "", tokenInv)
            ]);

            setAvatarImageWinner(cropAvatar(winnerRes.avatarImage) ?? null);
            setAvatarImageLoser(cropAvatar(loserRes.avatarImage) ?? null);
        };

        void loadAvatars();
    }, [winner?.user_id, loser?.user_id, tokenInv])


    useEffect(() => {
        if (results || !matchSocket || !match_id) return;

         matchSocket.sendResults({ match_id, pair_id: group_id })
            .then(res => {
                if (res.ok) {
                    useResultStore.getState().addResult(res.data!)
                    return res.data!;
                }

                setState('error');
            }).catch((e) => { console.log("Error: ", e); setState('error') });
    }, [results, matchSocket, match_id])


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
        if (!results) return;

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
        loser,
        avatarImageWinner,
        avatarImageLoser
    };
}