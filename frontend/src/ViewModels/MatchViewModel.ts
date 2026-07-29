
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import pink_robot from 'src/assets/Robots/HelloRobot_Pink.png'
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { GameQuestionsDTO } from "src/dtos/game-questionDTO";
import type { Player, Answer, Question, MatchProgress } from "src/Models/MatchModel";


export const useMatch = () => {
    const { socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;

    const [players] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [matchDuration, setMatchDuration] = useState(0);
    const [playerLife, setPlayerLife] = useState<number[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(false);
    const [questionsReady, setQuestionsReady] = useState(false)

    const answers: Answer[] = [];
    const progress: MatchProgress = {
        player_progress: [0, 0],
        question_number: 0
    }

    const closeLoading = () => setLoading(false);

    const expiry_time = useMemo(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + matchDuration * 60);
        return time;
    }, [matchDuration])

    const { seconds, minutes, restart } = useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false
    });

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1)
            setCurrentQuestion(curr + 1);
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0)
            setCurrentQuestion(curr - 1)
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

    const loadQuestions = (data: GameQuestionsDTO) => {
        let temp_arr: Question[] = [];
        let sumtime = 0;

        for (const q of data.easy) {
            temp_arr.push({
                title: q.title!,
                difficulty: "Easy",
                description: q.description,
            })

            sumtime += Number(q.time_limit!.split(":")[1])
        }

        for (const q of data.medium) {
            temp_arr.push({
                title: q.title,
                difficulty: "Medium",
                description: q.description
            })
            sumtime += Number(q.time_limit!.split(":")[1])
        }

        for (const q of data.hard) {
            temp_arr.push({
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
                title: t.title!,
                difficulty: t.difficulty,
                description: t.description
            }

            final.push(q);
        }

        setQuestions(final);
        setQuestionsReady(true);
    }

    useEffect(() => {
        if (matchDuration > 0) {
            restart(expiry_time);
        }
    }, [matchDuration])

    useEffect(() => {
        if (socket) {
            socket.emit('send_questions', id)

            socket.on('get_questions', loadQuestions)

           // eslint-disable-next-line react-hooks/set-state-in-effect
            if (questions.length === 0) setLoading(true)
            else setLoading(false)


            setPlayerLife(players.map(p => p.life = 100))
            setAvatars(players.map(p => p.avatar));
            setUsernames(players.map(p => p.username));

            //// TEMPORARY REMOVE ONCE DATA IS FETCHED

            setAvatars(prev => [...prev, pink_robot, pink_robot]);
            setUsernames(prev => [...prev, "YOU", "OPPONENT"])

            return () => {
                socket.off("get_questions", loadQuestions);
            }
        }

    }, [socket, players, questionsReady])

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
        closeLoading
    }
}