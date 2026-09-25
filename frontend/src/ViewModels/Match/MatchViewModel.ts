import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { MarkingResultDTO, MathsSubmissionDTO, ProgSubmissionDTO, SubmissionDTO } from "src/dtos/match/submission.dto";
import { robot_map } from 'src/assets/Robots';
import {  useMatchProgress } from 'src/services/match.service';

import { useMatchStore } from 'src/stores/match-store';
import { useUser } from 'src/context/User/hooks/useUser';

export const useMatch = () => {
    const nav = useNavigate();
    const { matchSocket } = useSocket();
    const { id } = useParams();
    const { match_mode, gameType } = useMatchmaking();
    const { userId } = useUser();
    const [gameOver, setGameOver] = useState(false);
    const { loadRounds } = useGameQuestions();

    const question_idx = useRef(0);
    const round_idx = useRef(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [nextRound, setNextRound] = useState(false);

    const status = useMatchStore(state => state.status);
    const { rounds, duration } = loadRounds(useMatchStore(state => state.rounds)!);
    const questions = rounds[round_idx.current] ?? [];
    const players = useMatchStore(state => state.players);

    const { playerLife, opponentCurrent, opponent_progress, opponent_done, opponentDone, updatePlayerLife } = useMatchProgress(questions.length, players);
    const avatars = useMemo(() => players.map(p => robot_map[p.avatar_id]), [players]);
    const usernames = useMemo(() => players.map(p => p.username), [players]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<(boolean | null)[][]>([]);
    const mathfieldRef = useRef<MathfieldElement | null>(null)

    const [waitingOpponent, setWaitingOpponent] = useState(false);

    const closeLoading = () => setLoading(false);

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1) {
            setCurrentQuestion(curr + 1);
            return;
        }

        if (round_idx.current < rounds.length - 1) {
            round_idx.current += 1;
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

    const { seconds, minutes } = useGameTimer(duration, () => {
        setGameOver(true);
        matchSocket?.finishMatch({ match_id: id!, match_mode: match_mode! })
    })


    

    const submission_error = (error: string) => {
        console.error(error)
    }

    const submitQuestion = async (data: MathsSubmissionDTO | ProgSubmissionDTO) => {
        const curr_q = questions[currentQuestion];
        const submission: SubmissionDTO = {
            match_id: id!,
            player_id: userId,
            question_id: curr_q.id!,
            round_number: round_idx.current,    // to be updated
            question_number: currentQuestion,
            match_type: gameType!,
            match_mode: match_mode!,
            submission: data
        }

        matchSocket?.submitAnswer(submission);
    }


    useEffect(() => {
        if (matchSocket && id) {

            const unsub_marking = matchSocket.markingComplete(submission_result);
            const unsub_submission_error = matchSocket.submissionError(submission_error);
            const unsub_done = matchSocket.bothDone(both_done);
            const unsub_opponent_progress = matchSocket.opponentProgress(opponent_progress);
            const unsub_opponent_done = matchSocket.opponentDone(opponent_done);

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
        nextRound
    }
}