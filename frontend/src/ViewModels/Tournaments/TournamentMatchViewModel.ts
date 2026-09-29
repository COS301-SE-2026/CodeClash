// import { useParams } from "react-router-dom";
import { useMatch } from "../Match/MatchViewModel";
import { useEffect, useState } from "react";
import { useUser } from "src/context/User/hooks/useUser";
import type { PlayerStandingDTO } from "src/dtos/tournaments/tournament.dto";
import { useMatchStore } from "src/stores/match-store";

export const useTournamentMatch = () => {
    const {
        seconds,
        minutes,
        rounds,
        submitQuestion,
        finishMatch,
        nextQuestion,
        prevQuestion,
        questions,
        roundIdx,
        total_rounds,
        currentQuestion,
        mathfieldRef,
        colourClass
    } = useMatch();
    const players = useMatchStore(state => state.players) as PlayerStandingDTO[];
    const match_mode = useMatchStore(state => state.match_mode);
    const { userId } = useUser();
    const [activePlayers, setActivePlayers] = useState<PlayerStandingDTO[]>([]);

    const [code, setCode] = useState('');
    const [, setLanguage] = useState('');
    const [languageId, setLanguageId] = useState<number | null>(null);
    useEffect(() => {
        setActivePlayers(players as PlayerStandingDTO[]);
    }, [])

    const round_telemetry = () => {
        const cutoff_count = Math.max(1, Math.floor(activePlayers.length / 2));

        const cutoff_sort = [...activePlayers].sort((a, b) => b.correct - a.correct || a.total_time - b.total_time);

        const tied = cutoff_sort.every(p =>
            p.correct === cutoff_sort[0].correct && p.total_time === cutoff_sort[0].total_time
        );

        const in_danger = tied ? [] : activePlayers.slice(cutoff_count);
        const safe = tied ? cutoff_sort : activePlayers.slice(0, cutoff_count);

        const my_standing = activePlayers.find(p => p.id === userId);
        const my_rank = my_standing?.position ?? null;
        const my_pace = my_standing?.total_time ?? 0;

        const solve_sort = [...activePlayers].sort((a, b) => a.total_time - b.total_time);
        const fastest_solve = solve_sort[0] ?? { username: "-", total_time: 0 };

        return {
            in_danger,
            safe,
            my_standing,
            my_rank,
            my_pace,
            fastest_solve
        }
    }

    const handleSubmit = async () => {
        console.log("handle submit ", match_mode);
        if (match_mode === 'math') {
            const answer = mathfieldRef.current?.value ?? '';

            if (!answer.trim()) return;
            await submitQuestion({ answer },'tournament','math');
        } else {
            if (!code.trim() || languageId === null) return;
            await submitQuestion({
                source_code: code,
                language_id: languageId,
                stdin: null
            },'tournament','programming')
        }
    }


    return {
        players,
        seconds,
        minutes,
        rounds,
        submitQuestion,
        finishMatch,
        nextQuestion,
        prevQuestion,
        roundIdx,
        total_rounds,
        questions,
        activePlayers,
        currentQuestion,
        userId,
        round_telemetry,
        mathfieldRef,
        colourClass,
        setCode,
        setLanguage,
        setLanguageId,
        handleSubmit,
        match_mode
    }

}