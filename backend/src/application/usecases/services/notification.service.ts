import { Server } from "socket.io";
import { CompleteSubmissionResult, OpponentProgressDTO, SubmissionResult } from "src/entities/dtos/submission-result.dto";


export class NotificationService {
    constructor(
        private readonly io: Server
    ) { }

    markingComplete(user_id: string, result: CompleteSubmissionResult, life_update: number) {
        this.io.to(`user:${user_id}`).emit('marking_complete', {result: result, life: life_update});
    }

    markingPending(user_id: string, question_id: string){
        this.io.to(`user:${user_id}`).emit('marking_pending', question_id);
    }

    opponentProgress(opponent_id: string, progress: OpponentProgressDTO){
        this.io.to(opponent_id).emit('opponent_progress', progress);
    }

}