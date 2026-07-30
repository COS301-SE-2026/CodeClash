import { Server, Socket } from "socket.io";
import { CheckAnswer } from "src/application/usecases/check-answer";
import { FinishGame } from "src/application/usecases/systems/finish-game";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { SubmissionDTO } from "src/entities/dtos/components.dto";

import { StartQuestionDTO } from "src/entities/dtos/question.dto";
import { OpponentProgress } from "src/application/usecases/systems/opponent-progress";
import { GameStore } from "src/application/usecases/services/game-store.service";
import { GameType } from "src/entities/db-entities/questions.entities";

export const submitQuestion = async (
    io: Server, socket: Socket,
    data: SubmissionDTO,
    check_answer: CheckAnswer,
    opponent_progress: OpponentProgress
) => {
    try {
        const result = await check_answer.execute(data.match_id, socket.data.user_id, data.question_id, data.answer)

        io.to(socket.data.user_id).emit('submission_result', result);

        const opponent_id = opponent_progress.execute(data, socket.data.user_id);

        if (opponent_id === undefined) throw new Error("Couldn't get opponent")

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

export const startQuestion = (player_id: string, submission_system: SubmissionSystem, data: StartQuestionDTO,) => {
    submission_system.saveSubmission(data.match_id, player_id, data.question, null, '');
}

export const gameDone = async (io: Server, socket: Socket, game_id: number, game_type: GameType, finish_game: FinishGame, game_store: GameStore) => {
    // wait for both players to be done

    const game = game_store.get(game_id);

    if (!game) throw new Error("Invalid pair id");

    game_store.setDone(socket.data.user_id, game_id);

    if (game_store.bothDone(game_id)) {

        const ids = game.players.map(player => player.id);

        const game_result = await finish_game.execute(game_id, ids, game_type);
        game_store.saveResult(game_id, game_result);

        for (const id of ids) {
            io.to(id).emit('both_done');
        }
    } else {
        socket.emit('waiting_opponent');

        for (const p of game.players) {
            if (p !== socket.data.user_id) {
                io.to(p.id).emit('opponent_done');
                return;
            }
        }
    }

}

export const sendResults = (io: Server, game_id: number, pair_id: string, game_store: GameStore) => {

    const result = game_store.geResult(game_id);

    if (!result) throw new Error("Couldn't fetch result");

    const ids = result.players.map(player => player.user_id);
    for (const id of ids) {
        io.to(id).emit('get_result', result);
    }
}
