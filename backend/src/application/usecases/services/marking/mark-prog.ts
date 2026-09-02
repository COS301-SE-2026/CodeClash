import { ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { SubmissionResult } from "src/entities/dtos/submission-result.dto";

export class MarkProg implements MarkingStrategy {

    private readonly executor;

    constructor(code_executor: ICodeExecutor) {
        this.executor = code_executor;
    }

    async mark(submission: ProgSubmissionDTO, answer: string): Promise<SubmissionResult> {

        const submission_token = await this.executor.execute(submission.source_code, submission.language_id, submission.stdin, answer);

        return {
            token: submission_token
        }

    }
}