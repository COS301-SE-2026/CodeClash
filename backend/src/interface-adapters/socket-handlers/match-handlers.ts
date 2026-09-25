import { Server, Socket } from "socket.io";
import { MarkingService } from "src/application/usecases/services/marking/marking.service";
import { MatchStore } from "src/application/usecases/services/match/match-store.service";
import { MatchType } from "src/entities/dtos/matches/match.dto";
import { DeleteGame } from "src/application/usecases/systems/delete-game";
import { PlayerSubmissionDTO, RawSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { PlayerResultDTO } from 'src/entities/dtos/matches/match.dto'
import { MatchCompletionService } from "src/application/usecases/services/match/match-completion.service";

export const submitQuestion = async (socket: Socket, data: RawSubmissionDTO, mark: MarkingService, match_store: MatchStore) => {
    console.log("backend submit question", data);

    const ecs_id = match_store.getEcsId(data.match_id);
    const submission: PlayerSubmissionDTO = {
        ...data,
        match_id: ecs_id!,
    }
    return mark.execute({ ...submission, player_id: socket.data.user_id });
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
        const match_result = await match_completion_service.execute(match_id, match.database_id, ids, match_type);
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
