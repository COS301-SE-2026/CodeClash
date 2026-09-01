import { Server } from "socket.io";
import { SubmissionResult } from "src/entities/dtos/submission-result.dto";


export class NotificationService {
    constructor(
        private readonly io: Server
    ) { }

    submissionMarked(user_id: string, result: SubmissionResult) {
        this.io.to(`user:${user_id}`).emit('submission_marked', result);
    }
}