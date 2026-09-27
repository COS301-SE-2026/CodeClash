import { Server, Socket } from "socket.io";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { MatchStore } from "src/application/usecases/services/match/match-store.service";
import { MatchType } from "src/entities/dtos/matches/match.dto";
import { DeleteGame } from "src/application/usecases/systems/delete-game";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { PlayerResultDTO } from 'src/entities/dtos/matches/match.dto'
import { MatchCompletionService } from "src/application/usecases/services/match/match-completion.service";
import { UsePowerupDTO } from "src/entities/dtos/shop/powerup-use.dto";
import { PowerupService } from "src/application/usecases/services/shop/powerup.service";

export const submitQuestion = async (socket: Socket, data: PlayerSubmissionDTO, mark: MarkingService) => {
    return mark.execute({ ...data, player_id: socket.data.user_id });
}

// export const startQuestion = (player_id: string, submission_system: SubmissionSystem, data: StartQuestionDTO) => {
//     submission_system.saveSubmission(data,data);
// }

export const matchDone = async (io: Server, socket: Socket, match_id: number, match_type: MatchType, match_completion_service: MatchCompletionService, match_store: MatchStore) => {
    // wait for both players to be done
    const match = match_store.get(match_id);

    if (!match) {
        console.error("No match found");
        return;
    }

    match_store.setDone(socket.data.user_id, match_id);

    if (match_store.playersDone(match_id)) {

        const ids = match.players.map(player => player.id);
        const match_result = await match_completion_service.execute(match_id, match.database_id, ids,match_type);
        match_store.saveResult(match_id, match_result);

        for (const id of ids) {
            io.to(id).emit('both_done');
        }
    } else {
        socket.emit('waiting_opponent');

        for (const p of match.players) {
            if (p.id !== socket.data.user_id) {
                io.to(p.id).emit('opponent_done');
                return;
            }
        }
    }

}

export const sendResults = (io: Server, match_id: number, match_store: MatchStore) => {

    const result = match_store.getResult(match_id);
    const match = match_store.get(match_id);
    if (!match) {
        console.warn(`send_results: match ${match_id} not found`);
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

export const cleanUp = (match_id: number, pair_id: string, delete_match: DeleteGame, match_store: MatchStore) => {

    const match = match_store.get(match_id);

    if (match) {
        match.ack_count += 1;

        if (match.ack_count >= 4) {
            delete_match.execute(match_id, pair_id);
        }
    }

}

export const usePowerup = async (
    io: Server,
    socket: Socket,
    data: UsePowerupDTO,
    powerup_service: PowerupService
) => {
        const result = await powerup_service.usePowerup(
            socket.data.user_id,
            data.match_id,
            data.shop_item_id,
            data.target_user_id
        );

        // io.to(`user:${socket.data.user_id}`).emit('powerup_used', result);

        if (!data.target_user_id) return;

        if (!result.applied){
            io.to(`user:${data.target_user_id}`).emit('powerup_blocked', result);
            return;
        }

        if (result.effect === 'wipe_answer'){
            io.to(`user:${data.target_user_id}`).emit('clear_input');
        } else if (result.effect === 'insert_bugs') {
            io.to(`user:${data.target_user_id}`).emit('corrupt_input');
        } else {
            io.to(`user:${data.target_user_id}`).emit('powerup_received', result);
        }
    return result;
};
