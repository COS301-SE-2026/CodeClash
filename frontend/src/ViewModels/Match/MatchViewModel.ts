import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { robot_map } from 'src/assets/Robots';
import { useLoadRounds, useMatchProgress, useMatchTimer, useOpponentProgress } from 'src/services/match.service';

import { useMatchStore } from 'src/stores/match-store';
import { useMatchmaking } from 'src/context/Matchmaking/hooks/useMatchmaking';
import { useSubmission } from 'src/services/submission.service';

export const useMatch = () => {
    const nav = useNavigate();
    const { matchSocket } = useSocket();
    const { id } = useParams();
    const status = useMatchStore(state => state.status);
    const { matchMode } = useMatchmaking();

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [nextRound, setNextRound] = useState(false);
    const [loading, setLoading] = useState(false);
    const [waitingOpponent, setWaitingOpponent] = useState(false);
    const [roundIdx, setRoundIdx] = useState(0);

    const question_idx = useRef(0);
    const mathfieldRef = useRef<MathfieldElement | null>(null)


    const players = useMatchStore(state => state.players);
    const stored_rounds = useMatchStore(state => state.rounds)!;


    const { rounds, duration } = useLoadRounds(stored_rounds);
    const questions = rounds[roundIdx] ?? [];
    const { playerLife } = useMatchProgress(players);
    const {opponentProgress,handleOpponentDone , opponentCurrent, opponentDone } = useOpponentProgress(questions.length, players);
    const { submissionResult, submissionError, submitQuestion ,results} = useSubmission({ round_idx: roundIdx, curr_question: currentQuestion, question: questions[currentQuestion], match_id: id! })
    const { seconds, minutes } = useMatchTimer(duration, () => {
        setGameOver(true);
        matchSocket?.finishMatch({ match_id: id!, match_mode: matchMode! })
    })


    const avatars = useMemo(() => players.map(p => robot_map[p.avatar_id]), [players]);
    const usernames = useMemo(() => players.map(p => p.username), [players]);



    const closeLoading = () => setLoading(false);

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1) {
            setCurrentQuestion(curr + 1);
            return;
        }

        if (roundIdx < rounds.length - 1) {
            setRoundIdx(roundIdx + 1);
            setCurrentQuestion(0);
            setNextRound(true);
            setTimeout(() => setNextRound(false), 5000);
        }
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0) {
            setCurrentQuestion(curr - 1)
        }
    }

    const finishGame = () => {
        if (question_idx.current === questions.length - 1) {
            setWaitingOpponent(true);
        }
    }

    const both_done = () => {
        setWaitingOpponent(false);
        nav(`/results/${id}`, {
            replace: true,
        });
    }

    useEffect(() => {
        if (matchSocket && id) {

            const unsub_marking = matchSocket.markingComplete(submissionResult);
            const unsub_submission_error = matchSocket.submissionError(submissionError);
            const unsub_done = matchSocket.bothDone(both_done);
            const unsub_opponent_progress = matchSocket.opponentProgress(opponentProgress);
            const unsub_opponent_done = matchSocket.opponentDone(handleOpponentDone);

            setLoading(questions.length === 0);


            return () => {
                unsub_marking();
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
        finishGame,
        opponentCurrent,
        opponentDone,
        submitQuestion,
        nextRound,
        roundIdx
    }
}