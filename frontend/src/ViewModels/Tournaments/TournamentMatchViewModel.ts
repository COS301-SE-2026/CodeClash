// import { useParams } from "react-router-dom";
import { useMatch } from "../Match/MatchViewModel";
import { useEffect, useState } from "react";
import type { PlayerStandingDTO } from "src/dtos/tournaments/tournament.dto";
import { useMatchStore } from "src/stores/match-store";
import { useDbId } from "./useDbId";
import { useSocket } from "src/context/Socket/hooks/useSocket";

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
    const tournament_id = useMatchStore(state => state.tournament_id);
    const db_id = useDbId();
    const [activePlayers, setActivePlayers] = useState<PlayerStandingDTO[]>(players ?? []);
    const { tournamentSocket } = useSocket();

    const [code, setCode] = useState('');
    const [, setLanguage] = useState('');
    const [languageId, setLanguageId] = useState<number | null>(null);

    const round_telemetry = () => {

        const in_danger = activePlayers.filter(p => p.in_danger);
        const safe = activePlayers.filter(p => !p.in_danger);

        const my_standing = activePlayers.find(p => p.id === db_id);
        const my_rank = my_standing?.position ?? null;
        const my_pace = my_standing?.total_time ?? 0;

        const solve_sort = [...activePlayers].filter(p => p.correct > 0).sort((a, b) => a.total_time - b.total_time);
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
        console.log("tournament id", tournament_id);
        if (match_mode === 'math') {
            const answer = mathfieldRef.current?.value ?? '';

            if (!answer.trim()) return;
            await submitQuestion({ answer }, 'tournament', 'math', tournament_id!);
        } else {
            if (!code.trim() || languageId === null) return;
            await submitQuestion({
                source_code: code,
                language_id: languageId,
                stdin: null
            }, 'tournament', 'programming', tournament_id!)
        }
    }


    const handleStandings = (standings: PlayerStandingDTO[]) => {
        console.log("handling standings", standings);
        setActivePlayers(standings);
    }


    useEffect(() => {
        if (!tournamentSocket) return;
        console.log("Questions", questions);


        const unsub_standings = tournamentSocket.tournamentStandings(handleStandings)

        return () => {
            unsub_standings();
        }
    }, [tournamentSocket])

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
        db_id,
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