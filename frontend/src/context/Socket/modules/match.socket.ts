import type { Socket } from "socket.io-client";
import { emit, on } from "../dispatch";
import type { SubmissionDTO, MarkingResultDTO } from "src/dtos/match/submission.dto";
import type { MatchQuestionsDTO } from "src/dtos/match/match-questionDTO";
import type { MatchResultDTO, ResultDTO } from "src/dtos/match/result.dto";
import type { MatchMode, PlayerDTO } from "src/dtos/match/match.dto";
import type { Player } from "src/Models/MatchModel";
import type { OpponentDTO } from "src/dtos/match/opponent.dto";


export class MatchSocket {
    private readonly socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }


    /************************************** LISTENERS ******************************************* */

    getQuestions(handler: (data: MatchQuestionsDTO) => void) {
        return on<MatchQuestionsDTO>(this.socket, 'get_questions', handler);
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

    getResults(handler: (data: ResultDTO) => void) {
        return on(this.socket, 'get_results', handler);
    }

    startMatch(handler: (data: { match_id: string, questions: MatchQuestionsDTO, players: PlayerDTO[] }) => void) {
        return on(this.socket, 'start_match', handler);
    }

    startMatchError(handler: (data: { error: string }) => void) {
        return on(this.socket, 'start_match_failed', handler);
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

    sendResults(data: { match_id: string, pair_id: string }) {
        return emit<{ match_id: string, pair_id: string }, void>(this.socket, 'send_results', data);
    }

    cleanUpMatch(data: { match_id: string, pair_id: string }) {
        return emit<{ match_id: string, pair_id: string }, void>(this.socket, 'clean_up', data);
    }
}






