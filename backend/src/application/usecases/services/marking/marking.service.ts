import { IMatchCache } from "src/application/interfaces/cache/IMatchCache";
import { LifeSystem } from "src/application/usecases/systems/life.system";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { NotificationService } from "../notification.service";
import { IMarkingStrategy, MarkOutcome } from "src/application/interfaces/marking/IMarkingStategy";
import { OpponentProgress } from "../../systems/opponent-progress";
import { SubmissionComponent } from "src/entities/components";
import { MathsSubmissionDTO, PlayerSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import type { MarkingResultDTO } from "src/entities/dtos/submissions/submission-result.dto";

export class MarkingService {

    constructor(
        private readonly game_cache: IMatchCache,
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly notifications: NotificationService,
        private readonly maths_marking_strategy: IMarkingStrategy,
        private readonly prog_marking_strategy: IMarkingStrategy,
        private readonly opponent_progress: OpponentProgress
    ) { }


    async mark(player_submission: PlayerSubmissionDTO): Promise<MarkOutcome> {
        const correct_answer = await this.game_cache.getAnswer(player_submission.question_id);

        if (!correct_answer) throw new Error("Invalid question id");
        if (!player_submission.submission) throw new Error("Invalid Submission");

        const strategy = this.setStrategy(player_submission.submission);
        return await strategy.mark(player_submission.submission, correct_answer);
    }

    async execute(player_submission: PlayerSubmissionDTO): Promise<MarkingResultDTO> {
        try {
            const result = await this.mark(player_submission);
            const submission = this.submission_system.saveSubmission(player_submission, result.correct, result);
            return this.handleResult(result.correct, submission!);
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
            player_id: submission.player_id,
            correct: result,
            speed: submission.submitted_at!.getTime() - submission.started_at!.getTime(),
            attempt_number: submission.attempt_number,
            life_update: new_life
        };
    }

    private setStrategy(submission: MathsSubmissionDTO | ProgSubmissionDTO): IMarkingStrategy {
        if ('answer' in submission)
            return this.maths_marking_strategy;


        if ('source_code' in submission) return this.prog_marking_strategy;

        throw new Error("Unsupported submission type");
    }
}