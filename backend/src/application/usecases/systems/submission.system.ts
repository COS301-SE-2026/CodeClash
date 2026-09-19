import { SubmissionComponent, SubmissionRegistryComponent } from "src/entities/components";
import { PlayerSubmissionDTO } from "src/entities/dtos/components.dto";
import { World } from "src/entities/World";

export class SubmissionSystem {
    private readonly getMatchComponent
    private readonly getSubmissionComponent
    private readonly createEntity
    private readonly addSubmissionComponent

    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { getMatchComponent, getSubmissionComponent, createEntity, addSubmissionComponent } = this.world
        this.getMatchComponent = getMatchComponent;
        this.createEntity = createEntity;
        this.addSubmissionComponent = addSubmissionComponent;
        this.getSubmissionComponent = getSubmissionComponent
    }

    saveSubmission(sub: PlayerSubmissionDTO, is_correct: boolean | null) {

        // 1 lookup submission entity
        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(sub.match_id, "Submission");

        if (!submission_registry) { throw new Error("Error saving submission") }

        const key = `${sub.player_id}::${sub.round_id}::${sub.question_id}`;
        const submission_entity = submission_registry.submissions.get(key);
        let submission_component: SubmissionComponent | null;

        // 2 if found update component with new submission  -- an extra step would be added here to save submission later on for history
        if (submission_entity !== undefined) {
            submission_component = this.getSubmissionComponent(submission_entity, 'Submission')
            submission_component!.attempt_number += 1;
            submission_component!.correct = is_correct;
            submission_component!.answer = sub.submission;
            submission_component!.submitted_at = new Date();
        }
        else {  // 3 if not found 
            //  3.1 create submission enity
            const submission = this.createEntity();

            //  3.2 attach submission component

            submission_component = {
                match_id: sub.match_id,
                player_id: sub.player_id,
                question_id: sub.question_id,
                round_id: sub.round_id,
                question_number: sub.question_number!,
                started_at: new Date(),
                attempt_number: is_correct === null ? 0 : 1,
                answer: sub.submission,
                submitted_at: new Date(),
                correct: is_correct,
                token: undefined
            }

            this.addSubmissionComponent(submission, 'Submission', submission_component);

            //  3.3 register entity in matchs' submission registry
            submission_registry.submissions.set(key, submission);
        }
        return submission_component;
    }

    getSubmission(sub: PlayerSubmissionDTO) {

        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(sub.match_id, "Submission");

        if (!submission_registry) { throw new Error("Error saving submission") }

        const key = `${sub.player_id}::${sub.round_id}::${sub.question_id}`;
        const submission_entity = submission_registry.submissions.get(key);

        if (submission_entity === undefined) return null;

        const submission_component = this.getSubmissionComponent(submission_entity, 'Submission')
        return submission_component;
    }

}