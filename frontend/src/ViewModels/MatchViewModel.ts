
import { MathfieldElement } from 'mathlive';
import { useEffect, useState, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import { useMatchmakingSocket } from "src/context/Socket/hooks/useMatchmakingSocket";
import { useSocket } from "src/context/Socket/hooks/useSocket";
import { useUser } from "src/context/User/hooks/useUser";
import type { GameQuestionsDTO } from "src/dtos/game-questionDTO";
import type { SubmissionDTO } from "src/dtos/submission.dto";
import type { Player, Question, MatchProgress } from "src/Models/MatchModel";
import { endGame } from "src/services/result.service";
import { submitAnswer } from "src/services/submission.service";
import type { OpponentDTO } from "src/dtos/opponent.dto";


export const useMatch = () => {
    const { socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;
    const { userId } = useUser();
    const nav = useNavigate();
    const { pairId } = useMatchmakingSocket()

    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [matchDuration, setMatchDuration] = useState(0);
    const [playerLife, setPlayerLife] = useState<number[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [opponentCurrent, setOpponentCurrent] = useState(0);
    const [loading, setLoading] = useState(false);
    const [questionsReady, setQuestionsReady] = useState(false)
    const [answers, setAnswers] = useState<Record<string, string>>();
    const [results, setResults] = useState<(boolean | null)[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [waitingOpponent, setWaitingOpponent] = useState(false);

    const mathfieldRef = useRef<MathfieldElement | null>(null)
    const q_index = useRef<number | null>(null);
    const op_index = useRef<number | null>(null);
    const players_ref = useRef(players);

    const progress: MatchProgress = {
        player_progress: [0, 0],
        question_number: 0
    }

    const closeLoading = () => setLoading(false);


    // TIMER

    const expiry_time = useMemo(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + matchDuration * 60);
        return time;
    }, [matchDuration])

    const { seconds, minutes, restart } = useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false,
        onExpire: async () => {
            setGameOver(true);
            await endGame(id, socket, pairId);
        }
    });

    //////////////////////////////////////////


    //  Question Handling
    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1) {
            setCurrentQuestion(curr + 1);
            startQuestion(userId, questions[curr].id!)
        }
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0) {
            setCurrentQuestion(curr - 1)
            startQuestion(userId, questions[curr].id!)
        }
    }

    const submitQuestion = (question_id: string, answer: string) => {
        q_index.current = currentQuestion;
        console.log(question_id)
        submitAnswer(socket, id, question_id, answer);
    }

    const finishGame = async () => {
        if (q_index.current === questions.length - 1) {
            setWaitingOpponent(true)
            await endGame(id, socket, pairId);
        }
    }

    const startQuestion = (player_id: string, question_id: string) => {
        const data = {
            match_id: id,
            player: player_id,
            question: question_id
        }

        socket?.emit('question_started', data);
    }


    // load questions helper
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

    const loadQuestions = (data: GameQuestionsDTO) => {
        let temp_arr: Question[] = [];
        let sumtime = 0;

        for (const q of data.easy) {
            temp_arr.push({
                id: q.id,
                title: q.title!,
                difficulty: "Easy",
                description: q.description,
            })

            sumtime += Number(q.time_limit!.split(":")[1])
        }

        for (const q of data.medium) {
            temp_arr.push({
                id: q.id,
                title: q.title,
                difficulty: "Medium",
                description: q.description
            })
            sumtime += Number(q.time_limit!.split(":")[1])
        }

        for (const q of data.hard) {
            temp_arr.push({
                id: q.id,
                title: q.title,
                difficulty: "Hard",
                description: q.description
            })
            sumtime += Number(q.time_limit!.split(":")[1])
        }

        setMatchDuration(sumtime);

        temp_arr = shuffle(temp_arr);

        const final: Question[] = []
        for (const t of temp_arr) {
            const q: Question = {
                id: t.id,
                title: t.title!,
                difficulty: t.difficulty,
                description: t.description
            }

            final.push(q);
        }

        setQuestions(final);
        setQuestionsReady(true);


        // first question ready 
        startQuestion(userId, final[0].id!);
    }

    ///////////////////////////////////////

    // Result Handling
    const submission_result = (result: SubmissionDTO) => {
        const index = q_index.current
        if (index === null) return;

        setResults((prev) => {
            const next = [...prev];
            next[index] = result.result;
            return next
        });

        const player_index = players_ref.current.findIndex(p => p.id === result.player_id)

        setPlayerLife((prev) => {
            const next = [...prev];
            next[player_index] = result.life_update;
            return next
        })
    }

    const submission_error = (error: string) => {
        console.error(error)
    }

    const waiting_opponent = () => {
        setWaitingOpponent(true);
    }

    const both_done = () => {
        setWaitingOpponent(false);
        nav('/results', {
            replace: true,
            state: {
                id: id
            }
        });
    }

    const opponent_progress = (data: OpponentDTO) => {
        console.log(data)

        setOpponentCurrent((prev) => {
            if (data.correct === true) return prev + 1
            else return prev
        });
        const player_index = players_ref.current.findIndex(p => p.id === data.player_id)
        if (player_index === -1) return

        setPlayerLife((prev) => {
            const next = [...prev];
            next[player_index] = data.opponent_life;
            return next
        })


    }
    // Use Effects

    useEffect(() => {
        if (matchDuration > 0) {
            restart(expiry_time);
        }
    }, [matchDuration])

    useEffect(() => {
        if (results[currentQuestion] === true) {
            nextQuestion(currentQuestion);
        }
    }, [results, currentQuestion])

    useEffect(() => {
        players_ref.current = players
        setPlayerLife(players.map(p => p.life))
        setAvatars(players.map(p => p.avatar));
        setUsernames(players.map(p => p.username));
    }, [players])

    useEffect(() => {
        if (socket) {
            socket.emit('send_questions', id)
            socket.emit('send_players', id);


            socket.on('get_questions', loadQuestions)
            socket.on('get_players', setPlayers)
            socket.on('submission_result', submission_result);
            socket.on("submission_error", submission_error);
            socket.on('waiting_opponent', waiting_opponent);
            socket.on('both_done', both_done)
            socket.on("opponent_progress", opponent_progress)

            if (questions.length === 0) setLoading(true)
            else { setLoading(false) }




            return () => {
                socket.off("get_questions", loadQuestions);
                socket.off("submission_result", submission_result);
                socket.off("submission_error", submission_error);
                socket.off('get_players', setPlayers);
                socket.off('waiting_opponent', waiting_opponent)
                socket.off('both_done', both_done)
                socket.off('opponent_progress', opponent_progress)
            }
        }

    }, [socket, questionsReady])

    return {
        players,
        questions,
        answers,
        progress,
        playerLife,
        avatars,
        seconds,
        minutes,
        usernames,
        currentQuestion,
        nextQuestion,
        prevQuestion,
        matchDuration,
        loading,
        closeLoading,
        submitQuestion,
        mathfieldRef,
        setAnswers,
        results,
        gameOver,
        waitingOpponent,
        finishGame,
        opponentCurrent
    }
}