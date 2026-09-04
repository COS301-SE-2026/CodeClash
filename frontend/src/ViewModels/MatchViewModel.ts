import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";
import type { SubmissionDTO } from "src/dtos/submission.dto";
import type { Player } from "src/Models/MatchModel";
import { endGame } from "src/services/result.service";
import { robot_map } from 'src/assets/Robots';
import { useGameQuestions, useGameTimer, useMatchProgress } from 'src/services/match.service';


export const useMatch = () => {
    const { socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;
    const { userId } = useUser();
    const closeLoading = () => setLoading(false);
    const { gameType } = useMatchmaking();

    const {
        questions,
        duration,
        currentQuestion,
        questionsReady,
        nextQuestion,
        prevQuestion,
        submitQuestion,
        question_idx,
        finishGame,
        loadQuestions,
        waitingOpponent,
        waiting_opponent,
        both_done
    } = useGameQuestions(id, userId, socket!, gameType);

    const { seconds, minutes } = useGameTimer(duration, () => {
        setGameOver(true);
        endGame(id, gameType, socket);
    })


    const [players, setPlayers] = useState<Player[]>([]);

    const {
        playerLife, opponentCurrent, opponent_progress, opponent_done, opponentDone, updatePlayerLife
    } = useMatchProgress(questions.length, players);

    const [avatars, setAvatars] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>();
    const [results, setResults] = useState<(boolean | null)[]>([]);
    const [gameOver, setGameOver] = useState(false);

    const mathfieldRef = useRef<MathfieldElement | null>(null)
    const players_ref = useRef(players);
    const q_index = useRef<number | null>(null);


    const submission_result = (result: SubmissionDTO) => {
        const index = question_idx.current;

        setResults((prev) => {
            const next = [...prev];
            next[index] = result.result;
            return next
        });

        updatePlayerLife(result.player_id, result.life_update);

        if (result.life_update <= 0) {
            finishGame();
            return;
        }

        if (result.result === true) nextQuestion(index)
    }

    const submission_error = (error: string) => {
        console.error(error)
    }

    useEffect(() => {
        players_ref.current = players

        setAvatars(players.map(p => robot_map[p.avatar_id]));
        setUsernames(players.map(p => p.username));

    }, [players])

    useEffect(() => {
        if (socket) {
            socket.emit('send_questions', id)
            socket.emit('send_players', id);


            socket.on('get_questions', loadQuestions)
            socket.on('get_players', setPlayers)
            socket.on('marking_complete', submission_result);
            socket.on("submission_error", submission_error);
            socket.on('waiting_opponent', waiting_opponent);
            socket.on('both_done', both_done)
            socket.on("opponent_progress", opponent_progress)
            socket.on("opponent_done", opponent_done);

            const loadLoader = async () => {
                if (questions.length === 0) setLoading(true)
                else { setLoading(false) }
            }


            void loadLoader()

            return () => {
                socket.off("get_questions", loadQuestions);
                socket.off("marking_complete", submission_result);
                socket.off("submission_error", submission_error);
                socket.off('get_players', setPlayers);
                socket.off('waiting_opponent', waiting_opponent)
                socket.off('both_done', both_done)
                socket.off('opponent_progress', opponent_progress)
                socket.off('opponent_done', opponent_done)
            }
        }

    }, [socket, questionsReady])

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
        submitQuestion,
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