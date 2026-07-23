
import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTimer } from "react-timer-hook";
import type { Player, Answer, Question, MatchProgress } from "src/Models/MatchModel";
import pink_robot from 'src/assets/Robots/HelloRobot_Pink.png'
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { GameQuestionsDTO, QuestionDTO } from "src/dtos/game-questionDTO";


export const useMatch = () => {
    const { socket } = useSocket();
    const location = useLocation();
    const { id } = location.state;

    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [match_duration, setMatchDuration] = useState(0);
    const [player_life, setPlayerLife] = useState<number[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [current_question, setCurrentQuestions] = useState(0);
    const [loading, setLoading] = useState(false);
    const [questions_ready, setQuestionsReady] = useState(false)

    const answers: Answer[] = [];
    const progress: MatchProgress = {
        player_progress: [0, 0],
        question_number: 0
    }

    const closeLoading = () => setLoading(false);

    const expiry_time = useMemo(() => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + match_duration * 60);
        return time;
    }, [match_duration])

    const { seconds, minutes, restart } = useTimer({
        expiryTimestamp: expiry_time,
        autoStart: false
    });

    const nextQuestion = (curr: number) => {
        if (curr < questions.length - 1)
            setCurrentQuestions(curr + 1);
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0)
            setCurrentQuestions(curr - 1)
    }

    function shuffle(array: Question[]) {
        let curr = array.length;
        let random;

        while (curr != 0) {
            random = Math.floor(Math.random() * curr);
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

        let final: Question[] = []
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
        if (match_duration > 0) {
            restart(expiry_time);
        }
    }, [match_duration])

    useEffect(() => {
        if (socket) {
            socket.emit('send_questions', id)

            socket.on('get_questions', loadQuestions)

            if (questions.length == 0) setLoading(true)
            else setLoading(false)


            setPlayerLife(players.map(p => p.life))
            setAvatars(players.map(p => p.avatar));
            setUsernames(players.map(p => p.username));

            //// TEMPORARY REMOVE ONCE DATA IS FETCHED

            setAvatars(prev => [...prev, pink_robot, pink_robot]);
            setUsernames(prev => [...prev, "YOU", "OPPONENT"])

            return () => {
                socket.off("get_questions", loadQuestions);
            }
        }

    }, [socket, players, questions_ready])

    return {
        players,
        questions,
        answers,
        progress,
        player_life,
        avatars,
        seconds,
        minutes,
        usernames,
        current_question,
        nextQuestion,
        prevQuestion,
        match_duration,
        loading,
        closeLoading
    }
}