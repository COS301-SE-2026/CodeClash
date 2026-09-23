import { Server, Socket } from "socket.io";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { MatchCompletionSystem } from "src/application/usecases/systems/match-completion.system";
// import { SubmissionSystem } from "src/application/usecases/systems/submission.system";

// import { StartQuestionDTO } from "src/entities/dtos/match/question.dto";
import { MatchStore } from "src/application/usecases/services/match/match-store.service";
import { MatchType } from "src/entities/dtos/matches/match.dto";
import { DeleteGame } from "src/application/usecases/systems/delete-game";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { PlayerResultDTO } from 'src/entities/dtos/matches/match-result.dto'

export const submitQuestion = async (socket: Socket, data: PlayerSubmissionDTO, mark: MarkingService) => {
    return mark.execute({ ...data, player_id: socket.data.user_id });
}

// export const startQuestion = (player_id: string, submission_system: SubmissionSystem, data: StartQuestionDTO) => {
//     submission_system.saveSubmission(data,data);
// }

export const gameDone = async (io: Server, socket: Socket, game_id: number, match_type: MatchType, pair_id: string, match_completion_system: MatchCompletionSystem, match_store: MatchStore) => {
    // wait for both players to be done
    const game = match_store.get(game_id);

    if (!game) {
        console.error("No game found");
        return;
    }

    match_store.setDone(socket.data.user_id, game_id);

    if (match_store.playersDone(game_id)) {

        const ids = game.players.map(player => player.id);

        const game_result = await match_completion_system.execute(game_id, ids, match_type, pair_id);
        match_store.saveResult(game_id, game_result);

        for (const id of ids) {
            io.to(id).emit('both_done');
        }
    } else {
        socket.emit('waiting_opponent');

        for (const p of game.players) {
            if (p.id !== socket.data.user_id) {
                io.to(p.id).emit('opponent_done');
                return;
            }
        }
    }

}

export const sendResults = (io: Server, game_id: number, pair_id: string, match_store: MatchStore) => {

    const result = match_store.getResult(game_id);
    const game = match_store.get(game_id);
    if (!game) {
        console.warn(`send_results: game ${game_id} not found`);
        return;
    }
    if (!result?.result) {
        console.error("No result foud")
        return;
    }

    const ids = result.result.players.map((player: PlayerResultDTO) => player.user_id);
    for (const id of ids) {
        io.to(id).emit('get_result', result);
    }
}

export const cleanUp = (game_id: number, pair_id: string, delete_game: DeleteGame, match_store: MatchStore) => {

    const game = match_store.get(game_id);

    if (game) {
        game.ack_count += 1;

        if (game.ack_count >= 4) {
            delete_game.execute(game_id, pair_id);
        }
    }

}
