import { SubmissionComponent, SubmissionRegistryComponent } from "src/entities/components";
import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/components.dto";
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

    saveSubmission(match_id: number, player_id: string, question_id: string, is_correct: boolean | null, answer: MathsSubmissionDTO | ProgSubmissionDTO | null, question_number: number) {

        // 1 lookup submission entity
        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, "Submission");

        if (!submission_registry) { throw new Error("Error saving submission") }

        const key = `${player_id}::${question_id}`
        const submission_entity = submission_registry.submissions.get(key);
        let submission_component: SubmissionComponent | null;

        // 2 if found update component with new submission  -- an extra step would be added here to save submission later on for history
        if (submission_entity !== undefined) {
            submission_component = this.getSubmissionComponent(submission_entity, 'Submission')
            submission_component!.attempt_number += 1;
            submission_component!.correct = is_correct;
            submission_component!.answer = answer;
            submission_component!.submitted_at = new Date();
        }
        else {  // 3 if not found 
            //  3.1 create submission enity
            const submission = this.createEntity();

            //  3.2 attach submission component

            submission_component = {
                match_id: match_id,
                player_id: player_id,
                question_id: question_id,
                question_number: question_number,
                started_at: new Date(),
                attempt_number: is_correct === null ? 0 : 1,
                answer: answer,
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

    getSubmission(match_id: number, player_id: string, question_id: string) {

        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, "Submission");
        
        if (!submission_registry) { throw new Error("Error saving submission") }

        const key = `${player_id}::${question_id}`
        const submission_entity = submission_registry.submissions.get(key);

        if (submission_entity === undefined) return null;

        const submission_component = this.getSubmissionComponent(submission_entity, 'Submission')
        return submission_component;
    }

}