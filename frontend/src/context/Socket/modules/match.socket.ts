import type { Socket } from "socket.io-client";
import { registerEmitter, registerHandler } from "../dispatch";
import type {  MathsSubmissionDTO, ProgSubmissionDTO, SubmissionDto, SubmissionResultDTO } from "src/dtos/match/submission.dto";
import type { PlayerDTO } from "src/dtos/matchmaking/matched-user.dto";
import type { QuestionDTO } from "src/dtos/match/game-questionDTO";
import type { MatchResultDTO } from "src/dtos/match/result.dto";
import type { MatchMode } from "src/Models/MatchHistoryModel";


export class MatchSocket {
    private socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }


    /************************************** LISTENERS ******************************************* */

    getQuestions(handler: (data: QuestionDTO[]) => void) {
        return registerHandler<QuestionDTO[]>(
            this.socket,
            'get_questions',
            handler
        );
    }

    getPlayers(handler: (data: PlayerDTO[]) => void) {
        return registerHandler<PlayerDTO[]>(
            this.socket,
            'get_players',
            handler
        );
    }

    markingComplete(handler: (data: SubmissionResultDTO) => void) {
        return registerHandler<SubmissionResultDTO>(
            this.socket,
            'marking_complete',
            handler
        );
    }

    submissionError(handler: (data: string) => void) {
        return registerHandler<string>(
            this.socket,
            'submission_error',
            handler
        );
    }

    waitingOpponent(handler: () => void) {
        return registerHandler(
            this.socket,
            'waiting_opponent',
            handler
        );
    }

    bothDone(handler: () => void) {
        return registerHandler(
            this.socket,
            'both_done',
            handler
        )
    }

    opponentProgress(handler: () => void) {
        return registerHandler(
            this.socket,
            'opponent_progress',
            handler
        );
    }

    opponentDone(handler: () => void) {
        return registerHandler(
            this.socket,
            'opponent_done',
            handler
        );
    }

    /************************************** EMITTERS ******************************************* */

    sendQuestions(match_id: string) {
        return registerEmitter<string, void>(
            this.socket,
            'send_questions',
            match_id
        );
    }

    sendPlayers(match_id: string) {
        return registerEmitter<string, void>(
            this.socket,
            'send_players',
            match_id
        );
    }

    startQuestion(data: SubmissionDto) {
        return registerEmitter<SubmissionDto, void>(
            this.socket,
            'start_question',
            data
        );
    }

    submitAnswer(data: MathsSubmissionDTO | ProgSubmissionDTO) {
        return registerEmitter<MathsSubmissionDTO | ProgSubmissionDTO, SubmissionResultDTO>(
            this.socket,
            `submit_${data.match_mode}_question`,
            data
        );
    }

    finishMatch(data: { match_id: string, match_mode: MatchMode }) {
        return registerEmitter<typeof data, MatchResultDTO>(
            this.socket,
            'game_done',
            data
        );
    }
}





