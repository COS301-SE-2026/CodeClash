import axios from "axios";
import { useState, useCallback, useEffect} from "react";
import { useAuth } from "src/context/Auth/hooks/useAuth";

import type { MatchRow } from "../Models/MatchHistoryModel";

//import { formatMatchSearchTime } from "src/Models/MatchSearchingModel";

const url = '/api/';

interface MatchHistoryViewModel {
    matches: MatchRow[];
    selected: MatchRow | null;
    isDetails: boolean;
    handleRowClick: (match: MatchRow) => void;
    handleCloseDetails: () => void;
}

export function MatchHistoryViewModelFunction(): MatchHistoryViewModel {
    const [selected, setSelected] = useState<MatchRow | null>(null);
    const [isDetails, setIsDetails] = useState(false);
    const [matches, setMatches] = useState<MatchRow[]>([]);
    const { token, user } = useAuth();

    useEffect( () => {
        if( !token) return;

        axios.get(url.concat(`matches`), {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setMatches(res.data.map((m: any) => ({
                id: m.match_id,
                mode: m.match_mode.toUpperCase(),
                type: m.match_type.toUpperCase(),
                timestamp: new Date(m.match_start).toLocaleString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                    hour:'2-digit', minute:'2-digit'
                }),
                result: m.position === 1 ? 'WIN' : 'LOSS',
                details: null
            })));
        }).catch(err => console.error('Error fetching match history:', err));
    }, [token]);

    const handleRowClick = useCallback(async (match: MatchRow) => {
        if (!token || !user) return;
        try {
            const res = await axios.get(url.concat(`matches/${match.id}`), {
                headers: { Authorization: `Bearer ${token}` }
            });
            // DB user_id is the Cognito sub, so match on it and fall back to username
            const me = res.data.players.find((p: any) => p.user_id === user.userId)
                ?? res.data.players.find((p: any) => p.username === user.username);
            if (!me) throw new Error('Player not found in match results');

            setSelected({
                ...match,
                details: {
                    score: `${me.correctness}%`,
                    totalTime: formatDuration(me.speed),
                    eloChange: me.eloEffect ?? 0,
                    date: match.timestamp,
                    time: ''
                }
            });
            setIsDetails(true);
        }catch(err) {
            console.error('Error fetching match details:', err);
        }
        
    }, [token, user]);

    const handleCloseDetails = useCallback(() => {
        setIsDetails(false);
        setTimeout(() => setSelected(null), 100);
    }, []);

    return {
        matches,
        selected,
        isDetails,
        handleRowClick,
        handleCloseDetails,
    };
}

function formatDuration(ms: number): string {
    const totalSeconds = Math.round(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}