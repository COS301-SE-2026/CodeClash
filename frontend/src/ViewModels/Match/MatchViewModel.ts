import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMatchmaking } from "src/context/Matchmaking/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { MarkingResultDTO } from "src/dtos/match/submission.dto";
import { robot_map } from 'src/assets/Robots';
import { useGameQuestions, useGameTimer, useMatchProgress } from 'src/services/match.service';

import { useMatchStore } from 'src/stores/match-store';

export const useMatch = () => {
    const nav = useNavigate();
    const { match_socket } = useSocket();
    const { id } = useParams();
    const closeLoading = () => setLoading(false);
    const { match_mode } = useMatchmaking();
    const [gameOver, setGameOver] = useState(false);
    const { loadQuestions } = useGameQuestions();
    const status = useMatchStore(state => state.status);
    const loaded_questions = loadQuestions(useMatchStore(state => state.questions)!);
    const questions = loaded_questions.questions;
    const players = useMatchStore(state => state.players);
    const { playerLife, opponentCurrent, opponent_progress, opponent_done, opponentDone, updatePlayerLife } = useMatchProgress(questions.length, players);
    const avatars = useMemo(() => players.map(p => robot_map[p.avatar_id]), [players]);
    const usernames = useMemo(() => players.map(p => p.username), [players]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>();
    const [results, setResults] = useState<(boolean | null)[]>([]);
    const mathfieldRef = useRef<MathfieldElement | null>(null)
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [waitingOpponent, setWaitingOpponent] = useState(false);
    const question_idx = useRef(0);


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

    const { seconds, minutes } = useGameTimer(loaded_questions.duration, () => {
        setGameOver(true);
        match_socket?.finishMatch({ match_id: id!, match_mode: match_mode! })
    })


    const submission_result = (result: MarkingResultDTO) => {
        const index = question_idx.current;

        setResults((prev) => {
            const next = [...prev];
            next[index] = result.correct;
            return next
        });

        updatePlayerLife(result.player_id, result.life_update);

        if (result.life_update <= 0) {
            finishGame();
            return;
        }

        if (result.correct === true) nextQuestion(index)
    }

    const submission_error = (error: string) => {
        console.error(error)
    }


    useEffect(() => {
        if (match_socket && id) {

            const unsub_marking = match_socket.markingComplete(submission_result);
            const unsub_submission_error = match_socket.submissionError(submission_error);
            const unsub_done = match_socket.bothDone(both_done);
            const unsub_opponent_progress = match_socket.opponentProgress(opponent_progress);
            const unsub_opponent_done = match_socket.opponentDone(opponent_done);

            setLoading(questions.length === 0);


            return () => {
                unsub_marking();
                unsub_submission_error();
                unsub_done();
                unsub_opponent_progress();
                unsub_opponent_done();
            }
        }

    }, [match_socket])

    return {
        status,
        players,
        questions,
        answers,
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
        setAnswers,
        results,
        gameOver,
        waitingOpponent,
        finishGame,
        opponentCurrent,
        opponentDone
    }
}