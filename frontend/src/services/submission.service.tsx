import { Socket } from "socket.io-client";

export const submitAnswer = (socket: Socket | null, match_id: number, question_id: string, answer: string) => {
    if (!socket) return;

    const data = {
        match_id: match_id,
        question_id: question_id,
        answer: answer
    }

    socket.emit('submit_question', data);
}