import { IMatchCache } from "src/application/interfaces/cache/IGameCache";
import { LifeSystem } from "src/application/usecases/systems/life.system";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { NotificationService } from "../notification.service";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { OpponentProgress } from "../../systems/opponent-progress";
import { SubmissionComponent } from "src/entities/components";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import type { MarkingResultDTO } from "src/entities/dtos/submissions/submission-result.dto";

export class MarkingService {

    constructor(
        private readonly game_cache: IMatchCache,
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly notifications: NotificationService,
        private readonly marking_strategy: MarkingStrategy,
        private readonly opponent_progress: OpponentProgress
    ) { }

    async execute(player_submission: PlayerSubmissionDTO): Promise<MarkingResultDTO> {
        try {

            const correct_answer = await this.game_cache.getAnswer(player_submission.question_id);

            if (!correct_answer) throw new Error("Invalid question id");
            if (!player_submission.submission) throw new Error("Invalid Submission");

            const result = await this.marking_strategy.mark(player_submission.submission, correct_answer);
            const submission = this.submission_system.saveSubmission(player_submission, result);
            return this.handleResult(result, submission!);
        }
        catch (error) {
            console.error(`Error Checking answer: ${error}`);
            throw (`${error}`)
        }
    }

    handleResult(result: boolean, submission: SubmissionComponent): MarkingResultDTO {
        const new_life = this.life_System.updatePlayerLife(submission.match_id, submission.player_id, result);
        const progress = this.opponent_progress.updateOpponent(submission.match_id, submission.player_id, submission.question_number, result, new_life);
        const opponent = this.opponent_progress.getOpponent(submission.match_id, submission.player_id);
        this.notifications.markingComplete(submission.player_id, result, new_life);
        this.notifications.opponentProgress(opponent!, progress);

        return {
            player_id: submission!.player_id,
            correct: result,
            speed: submission!.submitted_at!.getTime() - submission!.started_at!.getTime(),
            attempt_number: submission!.attempt_number,
            life_update: new_life
        };
    }
}