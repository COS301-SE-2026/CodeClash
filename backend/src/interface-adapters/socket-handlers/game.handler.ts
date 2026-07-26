import { Server, Socket } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { SubmissionDTO } from "src/entities/dtos/components.dto";
import { StartQuestionDTO } from "src/entities/dtos/question.dto";


export const submitQuestion = async (io: Server, socket: Socket, data: SubmissionDTO, check_answer: CheckAnswer) => {
    try {
        const result = await check_answer.execute(data.match_id, socket.data.user_id, data.question_id, data.answer)

        io.to(socket.data.user_id).emit('submission_result', result);

    }
    catch (error: unknown) {
        io.to(socket.data.user_id).emit('submission_error', error);
        return;
    }
}

export const startQuestion = (submission_system: SubmissionSystem, data: StartQuestionDTO) => {
    console.log("question started")
    submission_system.saveSubmission(data.match_id, data.player, data.question, null, '');
}
