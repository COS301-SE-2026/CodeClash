import { Server, Socket } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { FinishGame } from "src/application/usecases/systems/finish-game";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { ResultComponent } from "src/entities/components";
import { SubmissionDTO } from "src/entities/dtos/components.dto";

import { StartQuestionDTO } from "src/entities/dtos/question.dto";
import { OpponentProgress } from "src/application/usecases/systems/opponent-progress";

export const submitQuestion = async (
    io: Server, socket: Socket,
    data: SubmissionDTO,
    check_answer: CheckAnswer,
    opponent_progres: OpponentProgress
) => {
    try {
        const result = await check_answer.execute(data.match_id, socket.data.user_id, data.question_id, data.answer)

        io.to(socket.data.user_id).emit('submission_result', result);


        const opponent_id = opponent_progres.execute(data, socket.data.user_id);

        if(opponent_id === undefined) throw new Error("Couldn't get opponent")

        //notify the opponent that this player answered
        io.to(opponent_id).emit('opponent_progress', {
            player_id: result.player_id,
            correct: result.result,
            opponent_life: result.life_update,
            question: data.question_number
        });
    }


    catch (error: unknown) {
        io.to(socket.data.user_id).emit('submission_error', error);
        return;
    }
}

export const startQuestion = (submission_system: SubmissionSystem, data: StartQuestionDTO,) => {
    submission_system.saveSubmission(data.match_id, data.player, data.question, null, '');
}

export const gameDone = (io: Server, socket: Socket, pair_id: string, game_id: number, finish_game: FinishGame, PAIRS: Map<string, Map<string, { accepted: boolean, elo: number, done?: boolean }>>, RESULTS: Map<number, ResultComponent>) => {
    // wait for both players to be done

    const pair = PAIRS.get(pair_id);


    if (!pair) throw new Error("Invalid pair id");
    const prev = pair.get(socket.data.user_id);

    if (!prev) throw new Error("invalid pair");

    pair.set(socket.data.user_id, { ...prev, done: true })

    const bothDone = [...pair.values()].every(val => val.done);
    console.log('both done: ', bothDone)
    if (bothDone) {

        const ids = [...pair.keys()]
        const result = finish_game.execute(game_id, ids);
        RESULTS.set(game_id, result);

        for (const id of ids) {
            io.to(id).emit('both_done');
        }
    } else {
        socket.emit('waiting_opponent');

        for (const p of pair.keys()) {
            if (p !== socket.data.user_id) {
                io.to(p).emit('opponent_done');
                return;
            }
        }
    }

}

export const sendResults = (io: Server, game_id: number, pair_id: string, RESULTS: Map<number, ResultComponent>, PAIRS: Map<string, Map<string, { accepted: boolean, elo: number, done?: boolean }>>) => {
    const result = RESULTS.get(game_id);
    const pair = PAIRS.get(pair_id);

    if (!result || !pair) throw new Error("Couldn't fetch result");

    const ids = [...pair.keys()]

    for (const id of ids) {
        io.to(id).emit('get_result', result);
    }
}
