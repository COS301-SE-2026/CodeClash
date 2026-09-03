import { ProgSubmissionDTO } from "src/entities/dtos/components.dto";
import { MarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { ProgSubmissionResult } from "src/entities/dtos/submission-result.dto";

export class MarkProg implements MarkingStrategy {

    private readonly executor;

    constructor(private readonly code_executor: ICodeExecutor) {
        this.executor = code_executor;
    }

    async mark(submission: ProgSubmissionDTO, answer: string): Promise<boolean> {
        const result: ProgSubmissionResult = await this.executor.execute(submission.source_code, submission.language_id, submission.stdin, answer);

        return result.status.id === 3;
    }
}