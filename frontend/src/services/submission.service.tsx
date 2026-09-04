<<<<<<< HEAD
import { Socket } from "socket.io-client";
import type { MathsSubmissionDTO, ProgSubmissionDTO } from "src/dtos/submission.dto";

export const submitAnswer = (socket: Socket | null, match_id: number, question_id: string, index: number, game_type: string, submission: ProgSubmissionDTO | MathsSubmissionDTO) => {
    if (!socket) return;

    const data = {
        match_id: match_id,
        question_id: question_id,
        question_number: index,
        submission: submission
    }

    socket.emit(`submit_${game_type}_question`, data);
 }
=======
import { Socket } from "socket.io-client";

export const submitAnswer = (socket: Socket | null, match_id: number, question_id: string, answer: string, index: number) => {
    if (!socket) return;

    const data = {
        match_id: match_id,
        question_id: question_id,
        answer: answer,
        question_number: index
    }

    socket.emit('submit_question', data);
}
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
