import { Server, Socket } from "socket.io";
import { MatchDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { PlayerSubmissionDTO } from "src/entities/dtos/components.dto";
import { cleanUp, matchDone, sendResults, submitQuestion } from "src/interface-adapters/socket-handlers/match-handlers";
import { StartQuestionDTO } from "src/entities/dtos/match/question.dto";
import { sendMatchQuestions } from "src/interface-adapters/socket-handlers/matchmaking-handlers";
import { MatchType } from "src/entities/dtos/match/match.dto";

// register handlers 
export function registerMatchHandlers(io: Server, socket: Socket, deps: MatchDeps) {
    registerHandler(
        socket,
        'submit_math_question',
        (socket, data: PlayerSubmissionDTO) => submitQuestion(socket, data, deps.math_marking_service)
    );

    registerHandler(
        socket,
        'submit_prog_question',
        (socket, data: PlayerSubmissionDTO) => submitQuestion(socket, data, deps.prog_marking_service)
    );

    // registerHandler(
    //     socket,
    //     'question_started',
    //     async (socket, data: StartQuestionDTO) => startQuestion(socket.data.user_id, deps.submission_system, data)
    // );

    registerHandler(
        socket,
        'ready_for_questions',
        async (socket, match_id: number) => sendMatchQuestions(io, match_id, deps.match_store)
    );

    registerHandler(
        socket,
        'game_done',
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

