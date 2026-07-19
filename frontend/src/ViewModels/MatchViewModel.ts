
import { useEffect, useState } from "react";
import { useTimer } from "react-timer-hook";
import type { Player, Answer, Question, MatchProgress } from "src/Models/MatchModel";
import pink_robot from 'src/assets/Robots/HelloRobot_Pink.png'


export const useMatch = () => {
    const [players, setPlayers] = useState<Player[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [match_duration, setMatchDuration] = useState(0);
    const [player_life, setPlayerLife] = useState<number[]>([]);
    const [avatars, setAvatars] = useState<string[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [current_question, setCurrentQuestions] = useState(0);
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

    const nextQuestion = (curr: number) => {
        if (curr < questions.length)
            setCurrentQuestions(curr + 1);
    }

    const prevQuestion = (curr: number) => {
        if (curr > 0)
            setCurrentQuestions(curr - 1)
    }

    questions.push({
        title: "Temp Question Title",
        difficulty: 'easy',
        question: 'This is the actual question',
        description: "This is a description to provide context to help solve the problem",
        number: 0
    })

    useEffect(() => {

        setPlayerLife(players.map(p => p.life))
        setAvatars(players.map(p => p.avatar));
        setUsernames(players.map(p => p.username));

        //// TEMPORARY REMOVE ONCE DATA IS FETCHED

        setAvatars(prev => [...prev, pink_robot, pink_robot]);
        setUsernames(prev => [...prev, "YOU", "OPPONENT"])


    }, [players])

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
        nextQuestion,
        prevQuestion,
        current_question
    }
}