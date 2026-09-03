import { IGameCache } from "src/application/interfaces/cache/IGameCache";
import { LifeSystem } from "src/application/usecases/systems/life.system";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { NotificationService } from "../notification.service";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { SubmissionResult } from "src/entities/dtos/submission-result.dto";
import { OpponentProgress } from "../../systems/opponent-progress";
import { SubmissionComponent } from "src/entities/components";


export class MarkingService {

    constructor(
        private readonly game_cache: IGameCache,
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly notifications: NotificationService,
        private readonly marking_strategy: MarkingStrategy,
        private readonly opponent_progress: OpponentProgress
    ) { }

    async execute(match_id: number, player_id: string, question_id: string, question_number: number, answer: string) {
        try {

            const correct_answer = await this.game_cache.getAnswer(question_id);

            if (!correct_answer) throw new Error("Invalid question id");

            const submission = this.submission_system.saveSubmission(match_id, player_id, question_id, null, answer, question_number);
            const result: SubmissionResult = await this.marking_strategy.mark(submission!, correct_answer);

            if (result.status === 'pending') {
                submission!.token = result.token;
                this.submission_system.registerSubmissionToken(result.token, submission!);
            }

            this.handleResult(result, submission!);

        }
        catch (error) {
            console.error(`Error Checking answer: ${error}`);
            throw new Error(`${error}`)
        }
    }

    handleResult(result: SubmissionResult,  submission: SubmissionComponent) {
        switch (result.status) {
            case 'pending':
                this.notifications.markingPending(submission.player_id, submission.question_id);
                break;
            case 'complete':

                this.submission_system.deregiserSubmissionToken(submission?.token!);
                const new_life = this.life_System.updatePlayerLife(submission.match_id, submission.player_id, result.correct!);
                const progress = this.opponent_progress.updateOpponent(submission.match_id, submission.player_id, submission.question_number, result, new_life);
                const opponent = this.opponent_progress.getOpponent(submission.match_id, submission.player_id);

                this.notifications.markingComplete(submission.player_id, result, new_life);
                this.notifications.opponentProgress(opponent!, progress);
                break;
        }

    }
}