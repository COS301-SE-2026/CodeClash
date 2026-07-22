
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import type { Player, Answer, Question, MatchProgress } from "src/Models/MatchModel";
import pink_robot from 'src/assets/Robots/HelloRobot_Pink.png'
import { useSocket } from "src/context/Socket/hooks/useSocket";
import type { GameQuestionsDTO, QuestionDTO } from "src/dtos/game-questionDTO";


export const useMatch = () => {
    const { socket } = useSocket();

    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [match_duration, setMatchDuration] = useState(0);
    const [player_life, setPlayerLife] = useState<number[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [current_question, setCurrentQuestions] = useState(0);
    const [time, setTime] = useState(0)

    const answers: Answer[] = [];
    const progress: MatchProgress = {
        player_progress: [0, 0],
        question_number: 0
    }

    const expiry_time = () => {
        const time = new Date();
        time.setSeconds(time.getSeconds() + match_duration * 60);
        return time;
    }

    const { seconds, minutes } = useTimer({ expiryTimestamp: expiry_time() });



    questions.push({
        title: "Temp Question Title",
        difficulty: 'easy',
        description: "This is a description to provide context to help solve the problem",
        number: 0
    })


    const nextQuestion = (curr: number) => {
        if (curr < questions.length)
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

        console.log("loading questions")
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

        for (const q of data.medium) {
            temp_arr.push({
                title: q.title,
                difficulty: "Hard",
                description: q.description
            })
            sumtime += Number(q.time_limit!.split(":")[1])
        }

        setTime(sumtime);

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
    }

    useEffect(() => {
        if (socket) {
            socket.on('questions_ready', loadQuestions)

            return () => {
                socket.off("questions_ready", loadQuestions);
            }
        }

        setPlayerLife(players.map(p => p.life))
        setAvatars(players.map(p => p.avatar));
        setUsernames(players.map(p => p.username));

        //// TEMPORARY REMOVE ONCE DATA IS FETCHED

        setAvatars(prev => [...prev, pink_robot, pink_robot]);
        setUsernames(prev => [...prev, "YOU", "OPPONENT"])



    }, [socket, players])

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
        time
    }
}