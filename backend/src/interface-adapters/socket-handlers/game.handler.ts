import { Server, Socket } from "socket.io";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { FinishGame } from "src/application/usecases/systems/finish-game";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { SubmissionDTO } from "src/entities/dtos/components.dto";

import { StartQuestionDTO } from "src/entities/dtos/question.dto";
import { GameStore } from "src/application/usecases/services/game-store.service";
import { GameType } from "src/entities/db-entities/questions.entities";
import { DeleteGame } from "src/application/usecases/systems/delete-game";

import { PlayerResultDTO } from 'src/entities/dtos/match-result.dto'

export const submitQuestion = async (
    io: Server, socket: Socket,
    data: SubmissionDTO,
    mark: MarkingService
) => {
    try {
        await mark.execute(data.match_id, socket.data.user_id, data.question_id, data.question_number!, data.answer)
    }
    catch (error: unknown) {
        io.to(socket.data.user_id).emit('submission_error', error);
        return;
    }
}

export const startQuestion = (player_id: string, submission_system: SubmissionSystem, data: StartQuestionDTO) => {
    submission_system.saveSubmission(data.match_id, player_id, data.question, null, '',data.question_number);
}

export const gameDone = async (io: Server, socket: Socket, game_id: number, game_type: GameType, pair_id: string, finish_game: FinishGame, game_store: GameStore) => {
    // wait for both players to be done

    const game = game_store.get(game_id);

    if (!game) {
        console.error("No game found");
        return;
    }

    game_store.setDone(socket.data.user_id, game_id);

    if (game_store.bothDone(game_id)) {

        const ids = game.players.map(player => player.id);

        const game_result = await finish_game.execute(game_id, ids, game_type, pair_id);
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

    const result = game_store.getResult(game_id);

    if (!result?.result) {
        console.error("No result foud")
        return;
    }

    const ids = result.result.players.map((player: PlayerResultDTO) => player.user_id);
    for (const id of ids) {
        io.to(id).emit('get_result', result);
    }
}

export const cleanUp = (game_id: number, pair_id: string, delete_game: DeleteGame, game_store: GameStore) => {

    const game = game_store.get(game_id);

    if (game) {
        game.ack_count += 1;

        if (game.ack_count >= 4) {
            delete_game.execute(game_id, pair_id);
        }
    }

}
