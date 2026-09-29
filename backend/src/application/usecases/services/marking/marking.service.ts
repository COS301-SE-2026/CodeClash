import { LifeSystem } from "src/application/usecases/systems/life.system";
import { SubmissionSystem } from "src/application/usecases/systems/submission.system";
import { IMarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { PlayerSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import type { MarkingResultDTO } from "src/entities/dtos/submissions/submission-result.dto";
import { MatchMode } from "src/entities/dtos/matches/match.dto";

export class MarkingService {

    constructor(
        private readonly submission_system: SubmissionSystem,
        private readonly life_System: LifeSystem,
        private readonly maths_marking_strategy: IMarkingStrategy,
        private readonly prog_marking_strategy: IMarkingStrategy,
    ) { }


    async mark(player_submission: PlayerSubmissionDTO): Promise<boolean> {
        if (!player_submission.submission) throw new Error("Invalid Submission");
        
        const strategy = this.setStrategy(player_submission);
        return await strategy.mark(player_submission);
    }

    async execute(player_submission: PlayerSubmissionDTO): Promise<MarkingResultDTO> {
        try {
            const result = await this.mark(player_submission);
            const submission = this.submission_system.saveSubmission(player_submission, result);
            const new_life = this.life_System.updatePlayerLife(submission!.match_id, submission!.player_id, result);

            return {
                player_id: submission!.player_id,
                correct: result,
                speed: submission!.submitted_at!.getTime() - submission!.started_at!.getTime(),
                attempt_number: submission!.attempt_number,
                life_update: new_life
            };
        }
        catch (error) {
            console.error("  throwing error", error)
            console.error(`Error Checking answer: ${error}`);
            throw (`${error}`)
        }
    }

    private setStrategy(submission: PlayerSubmissionDTO): IMarkingStrategy {
        if (submission.match_mode === MatchMode.Maths) {
            return this.maths_marking_strategy;
        }
        if (submission.match_mode === MatchMode.Programming) {
            return this.prog_marking_strategy;
        }

        throw new Error("Unsupported submission type");
    }
}