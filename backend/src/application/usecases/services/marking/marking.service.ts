import { IGameCache } from "src/application/interfaces/cache/IGameCache";
import { LifeSystem } from "src/application/usecases/systems/life.system";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { NotificationService } from "../notification.service";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ProgSubmissionResult, SubmissionResult } from "src/entities/dtos/submission-result.dto";
import { OpponentProgress } from "../../systems/opponent-progress";
import { SubmissionComponent } from "src/entities/components";
import {  PlayerSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";

export class MarkingService {

    constructor(
        private readonly game_cache: IGameCache,
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly notifications: NotificationService,
        private readonly marking_strategy: MarkingStrategy,
        private readonly opponent_progress: OpponentProgress
    ) { }

    async execute(player_submission: PlayerSubmissionDTO) {
        try {

            const correct_answer = await this.game_cache.getAnswer(player_submission.question_id);

            if (!correct_answer) throw new Error("Invalid question id");

            const result = await this.marking_strategy.mark(player_submission.submission, correct_answer, player_submission.question_id);
            const submission = this.submission_system.saveSubmission(player_submission.match_id, player_submission.player_id, player_submission.question_id, result, player_submission.submission, player_submission.question_number!);
            this.handleResult(result, submission!);
        }
        catch (error) {
            console.error(`Error Checking answer: ${error}`);
            throw new Error(`${error}`)
        }
    }

    handleResult(result: boolean, submission: SubmissionComponent) {
        const new_life = this.life_System.updatePlayerLife(submission.match_id, submission.player_id, result);
        const progress = this.opponent_progress.updateOpponent(submission.match_id, submission.player_id, submission.question_number, result, new_life);
        const opponent = this.opponent_progress.getOpponent(submission.match_id, submission.player_id);

        this.notifications.markingComplete(submission.player_id, result, new_life);
        this.notifications.opponentProgress(opponent!, progress);

    }
}