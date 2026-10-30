import { Server, Socket } from "socket.io";
import { MatchDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { RawSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { cleanUp, matchDone, rejoinMatch, sendResults, submitQuestion, usePowerup } from "src/interface-adapters/socket-handlers/match-handlers";
import { MatchMode, MatchType } from "src/entities/dtos/matches/match.dto";
import { UsePowerupSocketDTO } from "src/entities/dtos/shop/powerup-use.dto";

// register handlers 
export function registerMatchHandlers(io: Server, socket: Socket, deps: MatchDeps) {
    registerHandler(socket, 'submit_question', (socket, data: RawSubmissionDTO) =>
        submitQuestion(io, socket, data, deps.marking_service, deps.match_store, deps.elimination_service, deps.opponent_progress, deps.match_completion_service));

    registerHandler(socket, 'match_done', (socket, payload: { match_id: string, match_type: MatchType, match_mode: MatchMode }) =>
        matchDone(io, socket, payload.match_id, payload.match_type, deps.match_completion_service, deps.match_store, payload.match_mode)
    );
  registerHandler(socket, 'send_results', async (socket, payload: { match_id: string }) => sendResults(io, payload.match_id, deps.match_store, socket.data.user_id));

  registerHandler(socket, 'rejoin_match', async (socket, payload: { match_id: string }) => rejoinMatch(socket, payload.match_id, deps.match_store, deps.submission_system, deps.life_system, deps.powerup_system));

    registerHandler(socket, 'clean_up', async (socket, payload: { match_id: string, pair_id: string }) => cleanUp(payload.match_id, payload.pair_id, deps.match_deletion_system, deps.match_store)
    );

    registerHandler(socket, 'use_powerup', (socket, payload: UsePowerupSocketDTO) => usePowerup(io, socket, payload, deps.powerup_service, deps.powerup_system, deps.life_system, deps.match_store));

}

