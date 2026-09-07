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