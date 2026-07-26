import { Server, Socket } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { SubmissionDTO } from "src/entities/dtos/components.dto";


export const submitQuestion = async (io: Server, socket: Socket ,data: SubmissionDTO, check_answer: CheckAnswer) => {
    try {
        const result = await check_answer.execute(data.match_id, socket.data.user_id, data.question_id, data.answer)

        io.to(socket.data.user_id).emit('submission_result', result);

    }
    catch (error:unknown) {
        io.to(socket.data.user_id).emit('submission_error', error);
        return;
    }
}
