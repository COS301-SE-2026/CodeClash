import { Server, Socket } from "socket.io";
import { MatchDeps } from "../../dependencies";
import { registerHandler } from "../../dispatch";
import { PlayerSubmissionDTO } from "src/entities/dtos/components.dto";
import { cleanUp, gameDone, sendResults, startQuestion, submitQuestion } from "src/frameworks-drivers/socket/modules/match/handlers";
import { StartQuestionDTO } from "src/entities/dtos/question.dto";
import { sendGameQuestions } from "src/frameworks-drivers/socket/modules/matchmaking/handlers";
import { GameType } from "src/entities/database/questions.entities";

// register handlers 
export function registerMatchHandlers(io: Server, socket: Socket, deps: MatchDeps) {
    registerHandler(
        socket,
        'submit_math_question',
        (socket, data: PlayerSubmissionDTO) => submitQuestion(io, socket, data, deps.math_marking_service)
    );

    registerHandler(
        socket,
        'submit_prog_question',
        (socket, data: PlayerSubmissionDTO) => submitQuestion(io, socket, data, deps.prog_marking_service)
    );

    registerHandler(
        socket,
        'question_started',
        async (socket, data: StartQuestionDTO) => startQuestion(socket.data.user_id, deps.submission_system, data)
    );

    registerHandler(
        socket,
        'ready_for_questions',
        async (socket, match_id: number) => sendGameQuestions(io, match_id, deps.match_store)
    );

    registerHandler(
        socket,
        'game_done',
        (socket, payload: {
            match_id: number;
            game_type: GameType;
            pair_id: string;
        }) => gameDone(io, socket, payload.match_id, payload.game_type, payload.pair_id, deps.match_completion_system, deps.match_store)
    );

    registerHandler(
        socket,
        'send_results',
        async (socket, payload: {
            match_id: number,
            pair_id: string
        }) => sendResults(io, payload.match_id, payload.pair_id, deps.match_store)
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

