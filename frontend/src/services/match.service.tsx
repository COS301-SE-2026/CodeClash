import { useMemo, useRef, useState, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import { Socket } from "socket.io-client";
import type { GameType } from "src/dtos/matchmaking.dto";
import type { Player, Question } from "src/Models/MatchModel";
import { submitAnswer } from "src/services/submission.service";
import { endGame } from "src/services/result.service";
import type { GameQuestionsDTO } from "src/dtos/game-questionDTO";
import { useNavigate } from "react-router-dom";
import type { OpponentDTO } from "src/dtos/opponent.dto";
import type { MathsSubmissionDTO, ProgSubmissionDTO } from "src/dtos/submission.dto";

export const useGameTimer = (duration: number, onExpire: () => void) => {
    const expiry_time = useMemo(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + duration * 60);
        return time;
    }, [duration]);


    return useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false,
        onExpire
    })
}


function shuffle(array: Question[]) {
    let curr = array.length;
    let random;

    while (curr !== 0) {
        random = Math.floor(Math.random() * curr);  // NOSONAR - Math.random() is just to shuffle questions
        curr--;

        [array[curr], array[random]] = [array[random], array[curr]]
    }
    return array;
}

export const useGameQuestions = (
    match_id: string,
    user_id: string,
    socket: Socket,
    game_type: GameType
) => {
    const nav = useNavigate();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [duration, setDuration] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [questionsReady, setQuestionsReady] = useState(false);
    const [waitingOpponent, setWaitingOpponent] = useState(false);

    const question_idx = useRef(0);

    const startQuestion = (
        player_id: string,
        question_id: string,
        question_number: number
    ) => {
        const data = {
            match_id: match_id,
            player: player_id,
            question: question_id,
            question_number: question_number
        }

        socket?.emit('question_started', data);
    }

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1) {
            setCurrentQuestion(curr + 1);
            startQuestion(user_id, questions[curr + 1].id!, curr + 1)
        }
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0) {
            setCurrentQuestion(curr - 1)
            startQuestion(user_id, questions[curr - 1].id!, curr - 1)
        }
    }

    const submitQuestion = (question_id: string, game_type: string, submission: ProgSubmissionDTO | MathsSubmissionDTO) => {
        question_idx.current = currentQuestion;
        submitAnswer(socket, parseInt(match_id), question_id, question_idx.current, game_type, submission);
    }

    const finishGame = () => {
        if (question_idx.current === questions.length - 1) {
            setWaitingOpponent(true)
            endGame(parseInt(match_id), game_type, socket);
        }
    }

    const loadQuestions = (data: GameQuestionsDTO) => {
        const temp_arr: Question[] = [];
        let sumtime = 0;

        for (const q of data.easy) {
            temp_arr.push({
                id: q.id,
                title: q.title!,
                difficulty: "Easy",
                description: q.description,
            });

            sumtime += Number(q.time_limit!.split(":")[1])
        }

        for (const q of data.medium) {
            temp_arr.push({
                id: q.id,
                title: q.title,
                difficulty: "Medium",
                description: q.description
            });
            sumtime += Number(q.time_limit!.split(":")[1])
        }

        for (const q of data.hard) {
            temp_arr.push({
                id: q.id,
                title: q.title,
                difficulty: "Hard",
                description: q.description
            });
            sumtime += Number(q.time_limit!.split(":")[1])
        }

        setDuration(sumtime);
        shuffle(temp_arr);
        setQuestions(temp_arr);
        setQuestionsReady(true);

        startQuestion(user_id, temp_arr[0].id!, 0);
    }

    const waiting_opponent = () => {
        setWaitingOpponent(true);
    }

    const both_done = () => {
        setWaitingOpponent(false);
        nav('/results', {
            replace: true,
            state: {
                id: match_id
            }
        });
    }

    return {
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
    }

}

export const useMatchProgress = (
    num_questions: number,
    players: Player[]
) => {
    const [playerLife, setPlayerLife] = useState<number[]>([]);
    const [opponentCurrent, setOpponentCurrent] = useState(0);
    const [opponentDone, setOpponentDone] = useState(false);

    const players_ref = useRef(players);

    useEffect(() => {
        players_ref.current = players
        setPlayerLife(players.map(p => p.life))

    }, [players]);


    const opponent_progress = (data: OpponentDTO) => {
        const player_index = players_ref.current.findIndex(p => p.id === data.player_id)
        if (player_index === -1) return

        setOpponentCurrent((prev) => {
            const next = data.question + 1;
            return (next < num_questions) ? next : prev;
        });

        setPlayerLife((prev) => {
            const next = [...prev];
            next[player_index] = data.opponent_life;
            return next;
        });
    }

    const opponent_done = () => {
        setOpponentDone(true)
    }

    const updatePlayerLife = (player_id: string, life: number) => {
        const player_index = players_ref.current.findIndex(p => p.id === player_id);

        if (player_index === -1) return

        setPlayerLife((prev) => {
            const next = [...prev];
            next[player_index] = life;
            return next
        })

    }

    return {
        playerLife,
        opponentCurrent,
        opponent_progress,
        opponent_done,
        opponentDone,
        updatePlayerLife
    }
}