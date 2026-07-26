import { Server, Socket } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { FinishGame } from "src/application/usecases/systems/finish-game";
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

export const startQuestion = (submission_system: SubmissionSystem, data: StartQuestionDTO,) => {
    console.log("question started")
    submission_system.saveSubmission(data.match_id, data.player, data.question, null, '');
}

export const gameDone = (io: Server, socket: Socket, pair_id: string, game_id: number, finish_game: FinishGame, PAIRS: Map<string, Map<string, { accepted: boolean, elo: number, done?: boolean }>>) => {
    // wait for both players to be done

    const pair = PAIRS.get(pair_id);

    if (!pair) return;
    const prev = pair.get(socket.data.user_id);

    if (!prev) throw new Error("invalid pair");

    pair.set(socket.data.user_id, { ...prev, done: true })

    const bothDone = [...pair.values()].every(val => val.done);

    if (bothDone) {

        const ids = [...pair.keys()]
        const result = finish_game.execute(game_id, ids);

        for (const id of ids) {
            io.to(id).emit('game_result', result);
        }
    }

}
