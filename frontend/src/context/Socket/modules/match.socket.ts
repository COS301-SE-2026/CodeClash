import type { Socket } from "socket.io-client";
import { emit, on } from "../dispatch";
import type { SubmissionDTO, MarkingResultDTO } from "src/dtos/match/submission.dto";
import type { MatchQuestionsDTO, RoundDTO } from "src/dtos/match/match.dto";
import type { MatchResultDTO, ResultDTO } from "src/dtos/match/result.dto";
import type {  MatchType } from "src/dtos/match/match.dto";
import type { Player } from "src/Models/MatchModel";
import type { OpponentDTO } from "src/dtos/match/opponent.dto";
import type { UsePowerupDTO, UsePowerupResultDTO } from "src/dtos/powerup.dto";


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

    startMatch(handler: (data: { match_id: string, rounds: RoundDTO[], players: Player[] }) => void) {
        return on(this.socket, 'start_match', handler);
    }

    startMatchError(handler: (data: { error: string }) => void) {
        return on(this.socket, 'start_match_failed', handler);
    }

    powerupReceived(handler: (data: UsePowerupResultDTO) => void){
        return on<UsePowerupResultDTO>(this.socket, 'powerup_received', handler)
    }

    powerupBlocked(handler: (data: UsePowerupResultDTO) => void){
        return on<UsePowerupResultDTO>(this.socket, 'powerup_blocked', handler)
    }

    clearInput(handler: () => void ){
        return on(this.socket, 'clear_input', handler)

    }

    corruptInput(handler: () => void){
        return on(this.socket, 'corrupt_input', handler)
    }


    /************************************** EMITTERS ******************************************* */

    submitAnswer(data: SubmissionDTO) {
        return emit<SubmissionDTO, MarkingResultDTO>(this.socket, `submit_question`, data);
    }

    finishMatch(data: { match_id: string,  match_type: MatchType}) {
        return emit<typeof data, MatchResultDTO>(this.socket, 'match_done', data);
    }

    sendResults(data: { match_id: string, pair_id: string }) {
        return emit<typeof data, MatchResultDTO>(this.socket, 'send_results', data);
    }

    cleanUpMatch(data: { match_id: string, pair_id: string }) {
        return emit<typeof data, void>(this.socket, 'clean_up', data);
    }

    usePowerup(data: UsePowerupDTO){
        return emit<UsePowerupDTO, UsePowerupResultDTO>(this.socket, 'use_powerup', data)
    }
}






