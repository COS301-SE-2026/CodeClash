import { Server, Socket } from "socket.io";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { MatchStore } from "src/application/usecases/services/match/match-store.service";
import { MatchType } from "src/entities/dtos/matches/match.dto";
import { DeleteGame } from "src/application/usecases/systems/delete-game";
import { PlayerSubmissionDTO, RawSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { PlayerResultDTO } from 'src/entities/dtos/matches/match.dto'
import { MatchCompletionService } from "src/application/usecases/services/match/match-completion.service";
import { TournamentEliminationService } from "src/application/usecases/services/tournament/elimination.service";
import { OpponentProgress } from "src/application/usecases/systems/opponent-progress";
import { UsePowerupDTO } from "src/entities/dtos/shop/powerup-use.dto";
import { PowerupService } from "src/application/usecases/services/shop/powerup.service";

export const submitQuestion = async (
    io: Server, socket: Socket, data: RawSubmissionDTO, mark: MarkingService,
    match_store: MatchStore, elimination_service: TournamentEliminationService,
    opponent_progress: OpponentProgress) => {
    const ecs_id = match_store.getEcsId(data.id);
    const submission: PlayerSubmissionDTO = {
        ...data,
        match_id: ecs_id!,
        player_id: socket.data.user_id
    }

    switch (data.match_type) {
        case MatchType.tournament:
            return await elimination_service.submit(data.id, submission);

        default: {
            const result = await mark.execute(submission);
            const opponent = opponent_progress.getOpponentId(submission.match_id, submission.player_id);
            const progress = opponent_progress.updateOpponent(submission.player_id, submission.question_number!, result.correct, result.life_update!);

            if (opponent !== undefined) {
                io.to(opponent).emit("opponent_progress", progress);
            }

            return result;
        }
    }
}


export const matchDone = async (io: Server, socket: Socket, match_id: string, match_type: MatchType, match_completion_service: MatchCompletionService, match_store: MatchStore) => {
    // wait for both players to be done
    console.log("MATCH DONE");
    const ecs_id = match_store.getEcsId(match_id);
    const match = match_store.get(ecs_id!);

    console.log("match ", match);
    if (!match) {
        console.error("No match found");
        return;
    }

    match_store.setDone(socket.data.user_id, ecs_id!);

    if (match_store.playersDone(ecs_id!)) {

        console.log("completing match");
        const ids = match.players.map(player => player.id);
        const match_result = await match_completion_service.execute(ecs_id!, match.database_id, ids, match_type);
        console.log("results", match_result)
        match_store.saveResult(ecs_id!, match_result);

        for (const id of ids) {
            io.to(id).emit('both_done');
        }
        return match_result;
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

export const sendResults = (io: Server, match_id: string, match_store: MatchStore) => {
    const ecs_id = match_store.getEcsId(match_id);
    const result = match_store.getResult(ecs_id!);
    const match = match_store.get(ecs_id!);
    if (!match) {
        console.warn(`send_results: match ${ecs_id} not found`);
        return;
    }
    if (!result) {
        console.error("No result foud")
        return;
    }

    return result;
}

export const cleanUp = (match_id: string, pair_id: string, delete_match: DeleteGame, match_store: MatchStore) => {


    const ecs_id = match_store.getEcsId(match_id);
    const match = match_store.get(ecs_id!);

    if (match) {
        match.ack_count += 1;

        if (match.ack_count >= 4) {
            delete_match.execute(ecs_id!, pair_id);
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

    if (!result.applied) {
        io.to(data.target_user_id).emit('powerup_blocked', result);
        return;
    }

    if (result.effect === 'wipe_answer') {
        io.to(data.target_user_id).emit('clear_input');
    } else if (result.effect === 'insert_bugs') {
        io.to(data.target_user_id).emit('corrupt_input');
    } else {
        io.to(data.target_user_id).emit('powerup_received', result);
    }
    return result;
};
