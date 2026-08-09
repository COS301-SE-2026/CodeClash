import { useState, useCallback, useEffect} from "react";
import axios from "axios";
import type { MatchRow } from "../Models/MatchHistoryModel";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { formatMatchSearchTime } from "src/Models/MatchSearchingModel";

const url = 'http://localhost:3000/api/';

interface MatchHistoryViewModel {
    matches: MatchRow[];
    selected: MatchRow | null;
    isDetails: boolean;
    handleRowClick: (match: MatchRow) => void;
    handleCloseDetails: () => void;
}

export function MatchHistoryViewModelFunction(user_id: string): MatchHistoryViewModel {
    const [selected, setSelected] = useState<MatchRow | null>(null);
    const [isDetails, setIsDetails] = useState(false);
    const [matches, setMatches] = useState<MatchRow[]>([]);
    const { token } = useAuth();

    useEffect( () => {
        if( !token || !user_id) return;

        axios.get(url.concat(`users/${user_id}/matches`), {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            setMatches(res.data.map((m: any) => ({
                id: m.match_id,
                mode: m.mode.toUpperCase(),
                type: m.game_type.toUpperCase(),
                timestamp: m.match_start,
                result: m.result,
                details: null
            })));
        }).catch(err => console.error('Error fetching match history:', err));
    }, [user_id, token]);

    const handleRowClick = useCallback(async (match: MatchRow) => {
        if (!token) return;
        try {
            const res = await axios.get(url.concat(`users/${user_id}/matches/${match.id}`), {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSelected({
                ...match,
                details: {
                    score: res.data.score,
                    totalTime: res.data.totalTime,
                    numCorrect: res.data.questions.length,
                    date: formatDate(res.data.match_start),
                    time: formatTime(res.data.match_start)
                }
            });
            setIsDetails(true);
        }catch(err) {
            console.error('Error fetching match details:', err);
        }
        
    }, [user_id, token]);

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

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase();
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}