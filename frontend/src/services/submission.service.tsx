import { useEffect } from "react";
import { useSocket } from "src/context/Socket/hooks/useSocket"


export const submitAnswer = (match_id: number, question_id: string, answer: string) => {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        const data = {
            match_id: match_id,
            question_id: question_id,
            answer: answer
        }
        socket.emit('submit_question', data);
    }, [socket])
}