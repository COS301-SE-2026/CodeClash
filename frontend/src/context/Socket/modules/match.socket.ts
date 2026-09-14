import type { Socket } from "socket.io-client";
import { emit, on } from "../dispatch";
import type { SubmissionDTO, MarkingResultDTO } from "src/dtos/match/submission.dto";
import type { GameQuestionsDTO } from "src/dtos/match/game-questionDTO";
import type { MatchResultDTO } from "src/dtos/match/result.dto";
import type { MatchMode } from "src/dtos/match/match.dto";
import type { Player } from "src/Models/MatchModel";
import type { OpponentDTO } from "src/dtos/match/opponent.dto";


export class MatchSocket {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }


    /************************************** LISTENERS ******************************************* */

    getQuestions(handler: (data: GameQuestionsDTO) => void) {
        return on<GameQuestionsDTO>(this.socket, 'get_questions', handler);
    }

    getPlayers(handler: (data: Player[]) => void) {
        return on<Player[]>(this.socket, 'get_players', handler);
    }

    markingComplete(handler: (data: MarkingResultDTO) => void) {
        return on<MarkingResultDTO>(this.socket, 'marking_complete', handler);
    }

    submissionError(handler: (data: string) => void) {
        return on<string>(this.socket, 'submission_error', handler);
    }

    waitingOpponent(handler: () => void) {
        return on(this.socket, 'waiting_opponent', handler);
    }

    bothDone(handler: () => void) {
        return on(this.socket, 'both_done', handler);
    }

    opponentProgress(handler: (data: OpponentDTO) => void) {
        return on(this.socket, 'opponent_progress', handler);
    }

    opponentDone(handler: () => void) {
        return on(this.socket, 'opponent_done', handler);
    }

    /************************************** EMITTERS ******************************************* */

    sendQuestions(match_id: string) {
        return emit<string, void>(this.socket, 'send_questions', match_id);
    }

    sendPlayers(match_id: string) {
        return emit<string, void>(this.socket, 'send_players', match_id);
    }

    startQuestion(data: SubmissionDTO) {
        return emit<SubmissionDTO, void>(this.socket, 'start_question', data);
    }

    submitAnswer(data: SubmissionDTO) {
        return emit<SubmissionDTO, MarkingResultDTO>(this.socket, `submit_${data.match_mode}_question`, data);
    }

    finishMatch(data: { match_id: string, match_mode: MatchMode }) {
        return emit<typeof data, MatchResultDTO>(this.socket, 'game_done', data);
    }
}





