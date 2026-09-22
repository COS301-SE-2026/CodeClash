import { Server, Socket } from "socket.io";
import { MatchDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { PlayerSubmissionDTO } from "src/entities/dtos/components.dto";
import { cleanUp, matchDone, sendResults, submitQuestion } from "src/interface-adapters/socket-handlers/match-handlers";
import { sendMatchQuestions } from "src/interface-adapters/socket-handlers/matchmaking-handlers";
import { MatchType } from "src/entities/dtos/match/match.dto";

// register handlers 
export function registerMatchHandlers(io: Server, socket: Socket, deps: MatchDeps) {
    registerHandler(
        socket,
        'submit_question',
        (socket, data: PlayerSubmissionDTO) => submitQuestion(socket, data, deps.marking_service)
    );

    registerHandler(
        socket,
        'match_done',
        (socket, payload: {
            match_id: number,
            match_type:MatchType
        }) => matchDone(io, socket, payload.match_id, payload.match_type,deps.match_completion_service, deps.match_store)
    );

    registerHandler(
        socket,
        'send_results',
        async (socket, payload: {
            match_id: number
        }) => sendResults(io, payload.match_id, deps.match_store)
    );

    registerHandler(
        socket,
        'clean_up',
        async (socket, payload: {
            match_id: number,
            pair_id: string
        }) => cleanUp(payload.match_id, payload.pair_id, deps.match_deletion_system, deps.match_store)
    );
}

