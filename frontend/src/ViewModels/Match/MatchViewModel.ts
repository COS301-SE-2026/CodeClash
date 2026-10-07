import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { robot_map } from 'src/assets/Robots';
import { useLoadRounds, useMatchProgress, useMatchTimer, useOpponentProgress } from 'src/services/match.service';

import { useMatchStore } from 'src/stores/match-store';
import { useMatchmaking } from 'src/context/Matchmaking/hooks/useMatchmaking';
import { useAnswerResponse, useLifeShake, useSubmission } from 'src/services/submission.service';
import type { Player } from 'src/Models/MatchModel';
import { useResultStore } from 'src/stores/result-store';

export const useMatch = (timeUp?: () => Promise<void>) => {
    const nav = useNavigate();
    const { matchSocket } = useSocket();
    const status = useMatchStore(state => state.status);
    const matchmaking = useMatchmaking();

    // the stored copies survive a reload, the matchmaking context doesn't
    const matchMode = useMatchStore(state => state.match_mode) ?? matchmaking.matchMode;
    const matchType = useMatchStore(state => state.match_type) ?? matchmaking.matchType;
    const end_time = useMatchStore(state => state.end_time);
    const tournament_id = useMatchStore(state => state.tournament_id);

    const [currentQuestion, setCurrentQuestion] = useState(() => useMatchStore.getState().current_question);
    const [gameOver, setGameOver] = useState(false);
    const [nextRound, setNextRound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [waitingOpponent, setWaitingOpponent] = useState(false);
    const [roundIdx, setRoundIdx] = useState(() => useMatchStore.getState().round_idx);
    const [confirmRound, setConfirmRound] = useState(false);


    const finished_ref = useRef(false);
    const mathfieldRef = useRef<MathfieldElement | null>(null)


    const players = useMatchStore(state => state.players) as Player[];
    const stored_rounds = useMatchStore(state => state.rounds)!;
    const match_id = useMatchStore(state => state.match_id);

    const { rounds, duration } = useLoadRounds(stored_rounds, match_id);
    const questions = rounds[roundIdx] ?? [];
    const { playerLife, updatePlayerLife } = useMatchProgress(players);
    const { opponentProgress, handleOpponentDone, opponentCurrent, opponentDone } = useOpponentProgress(questions.length, players, updatePlayerLife);


    const { submissionError, submitQuestion, results, setResults, lastResult, marking, markingError } = useSubmission({ round_idx: roundIdx, curr_question: currentQuestion, question: questions[currentQuestion], match_id: match_id!, updatePlayerLife })
    const { seconds, minutes } = useMatchTimer(duration, end_time, async () => {
        setGameOver(true);
        if (timeUp) {
            await timeUp();
        }
        else
            await finishMatch(!tournament_id);
    })

  useEffect(() => {
    useMatchStore.getState().setProgress(roundIdx, currentQuestion);
  }, [roundIdx, currentQuestion])

  const last_round = roundIdx === rounds.length - 1;
  const last_q_of_round = questions.length > 0 && currentQuestion === questions.length - 1;
  const complete_round = last_q_of_round && !last_round;
  const final_question = last_q_of_round && last_round;

    const avatars = useMemo(() => players.map(p => robot_map[p.avatar_id]), [players]);
    const usernames = useMemo(() => players.map(p => p.username), [players]);
    const elos = useMemo(() => players.map(p => p.elo), [players]);
    const colourClass = useAnswerResponse(lastResult, currentQuestion);
    const shake = useLifeShake(lastResult);

    const closeLoading = () => setLoading(false);

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1) {
            setCurrentQuestion(curr + 1);
        }
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0) {
            setCurrentQuestion(curr - 1)
        }
    }

    const confirmCompleteRound = () => {
        if (complete_round || final_question) setConfirmRound(true);
    }

    const cancelCompleteRound = () => {
        setConfirmRound(false);
    }

    const completeRound = () => {
        if (!complete_round) return;
        setConfirmRound(false);
        setRoundIdx(r => r + 1);
        setCurrentQuestion(0);
        setNextRound(true);
        setTimeout(() => setNextRound(false), 500);
    }

    const finishMatch = async (force = false) => {
        // if (!final_question) return;
      if (!matchSocket || finished_ref.current || (!final_question && !force)) return;
        setWaitingOpponent(true);
        finished_ref.current = true;

        const response = await matchSocket?.finishMatch({ match_id: match_id!, match_type: matchType! });

        if (response?.ok)
            useResultStore.getState().addResult(response.data!);
    }

    const both_done = async () => {
        // useMatchStore.getState().reset();
        setWaitingOpponent(false);
        nav(`/results/${match_id}`, {
            replace: true,
            state: { id: match_id }
        });
    }

    // puts back what the server knows based on the match stored state (clock, lives, answers, opponent's question) after a reload or reconnect
    const rejoin = async (socket: NonNullable<typeof matchSocket>, id: string) => {
        try {
            const response = await socket.rejoinMatch({ match_id: id });
            if (!response.ok || !response.data) throw new Error("Match not found");
            const state = response.data;

            if (state.completed) {
                await both_done();
                return;
            }

            useMatchStore.getState().setEndTime(state.end_time, state.server_time);
            state.players.forEach(player => updatePlayerLife(player.id, player.life));
            if (state.opponent_progress) opponentProgress(state.opponent_progress);
            if (state.opponent_done) handleOpponentDone();

            const restored: (boolean | null)[][] = rounds.map(() => []);
            for (const submission of state.submissions) {
                const index = rounds[submission.round_number]?.findIndex(q => q.id === submission.question_id) ?? -1;
                if (index !== -1) restored[submission.round_number]![index] = submission.correct;
            }
            setResults(restored);

            if (state.done) {
                finished_ref.current = true;
                setWaitingOpponent(true);
            }
        }
        catch {
            // the server no longer has this match, so there's nothing to go back to
            useMatchStore.getState().reset();
            nav('/dashboard', { replace: true });
        }
    }

    useEffect(() => {
        if (matchSocket && match_id) {
            setLoading(true);


            const unsub_submission_error = matchSocket.submissionError(submissionError);
            const unsub_done = matchSocket.bothDone(both_done);
            const unsub_opponent_progress = matchSocket.opponentProgress(opponentProgress);
            const unsub_opponent_done = matchSocket.opponentDone(handleOpponentDone);

            setLoading(questions.length === 0);

            if (!tournament_id) void rejoin(matchSocket, match_id);

            return () => {
                unsub_submission_error();
                unsub_done();
                unsub_opponent_progress();
                unsub_opponent_done();
            }
        }

    }, [matchSocket])

    return {
        status,
        players,
        questions,
        playerLife,
        avatars,
        seconds,
        minutes,
        usernames,
        currentQuestion,
        nextQuestion,
        prevQuestion,
        loading,
        closeLoading,
        mathfieldRef,
        results,
        gameOver,
        waitingOpponent,
        finishMatch,
        opponentCurrent,
        opponentDone,
        submitQuestion,
        marking,
        markingError,
        nextRound,
        roundIdx,
        total_rounds: rounds.length,
        rounds,
        elos,
        colourClass,
        shake,
        complete_round,
        final_question,
        confirmRound,
        confirmCompleteRound,
        cancelCompleteRound,
        completeRound,
        matchType,
        matchMode
    }
}