import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";
import type { MarkingResultDTO } from "src/dtos/match/submission.dto";
import type { Player } from "src/Models/MatchModel";
import { robot_map } from 'src/assets/Robots';
import { useGameQuestions, useGameTimer, useMatchProgress } from 'src/services/match.service';


export const useMatch = () => {

    const { match_socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;
    const { userId } = useUser();
    const closeLoading = () => setLoading(false);
    const { gameType, match_mode } = useMatchmaking();

    const {
        questions,
        duration,
        currentQuestion,
        questionsReady,
        nextQuestion,
        prevQuestion,
        // submitQuestion,
        question_idx,
        finishGame,
        loadQuestions,
        waitingOpponent,
        waiting_opponent,
        both_done
    } = useGameQuestions(id, userId, match_socket, gameType!);

    const [gameOver, setGameOver] = useState(false);

    const { seconds, minutes } = useGameTimer(duration, () => {
        setGameOver(true);
        match_socket?.finishMatch({match_id: id, match_mode: match_mode!})
    })


    const [players, setPlayers] = useState<Player[]>([]);

    const {
        playerLife, opponentCurrent, opponent_progress, opponent_done, opponentDone, updatePlayerLife
    } = useMatchProgress(questions.length, players);

    const avatars = useMemo(() => players.map(p => robot_map[p.avatar_id]), [players]);
    const usernames = useMemo(() => players.map(p => p.username), [players]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>();
    const [results, setResults] = useState<(boolean | null)[]>([]);


    const mathfieldRef = useRef<MathfieldElement | null>(null)
    const players_ref = useRef(players);


    const submission_result = (result:  MarkingResultDTO ) => {
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

        if (result.correct=== true) nextQuestion(index)
    }

    const submission_error = (error: string) => {
        console.error(error)
    }

    useEffect(() => {
        players_ref.current = players

    }, [players])

    useEffect(() => {
        if (match_socket) {

            match_socket.sendQuestions(id);
            match_socket.sendPlayers(id);

            const cleanup = () => {
                match_socket.getQuestions(loadQuestions)();
                match_socket.getPlayers(setPlayers)();
                match_socket.markingComplete(submission_result)();
                match_socket.submissionError(submission_error)();
                match_socket.waitingOpponent(waiting_opponent)();
                match_socket.bothDone(both_done)();
                match_socket.opponentProgress(opponent_progress)();
                match_socket.opponentDone(opponent_done)();
            };


            const loadLoader = async () => {
                if (questions.length === 0) setLoading(true)
                else { setLoading(false) }
            }


            void loadLoader()

            return () => cleanup();
        }

    }, [match_socket, questionsReady])

    return {
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
        duration,
        loading,
        closeLoading,
        // submitQuestion,
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