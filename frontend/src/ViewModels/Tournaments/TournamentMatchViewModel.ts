// import { useParams } from "react-router-dom";
import { useMatch } from "../Match/MatchViewModel";
import { useEffect, useState } from "react";
import { useUser } from "src/context/User/hooks/useUser";
import type { PlayerStandingDTO } from "src/dtos/tournaments/tournament.dto";
import { useMatchStore } from "src/stores/match-store";

export const useTournamentMatch = () => {
    // const { tournament_id } = useParams<{ tournament_id: string }>();

    const { seconds, minutes, rounds,
        submitQuestion, finishGame,
        nextQuestion, prevQuestion, questions,
        roundIdx, total_rounds,
        currentQuestion } = useMatch();
    const players = useMatchStore(state => state.players) as PlayerStandingDTO[];
    const { userId } = useUser();
    const [activePlayers, setActivePlayers] = useState<PlayerStandingDTO[]>([]);

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


    return {
        players,
        seconds,
        minutes,
        rounds,
        submitQuestion,
        finishGame,
        nextQuestion,
        prevQuestion,
        roundIdx,
        total_rounds,
        questions,
        activePlayers,
        currentQuestion,
        userId,
        round_telemetry
    }

}