import { PlayerSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { ProgSubmissionResult } from "src/entities/dtos/submissions/submission-result.dto";
import { IQuestionRepository } from "src/application/interfaces/repositories/IQuestionRepository";

export class MarkProg implements IMarkingStrategy {

    private readonly executor;

    constructor(
        private readonly code_executor: ICodeExecutor,
        private readonly question_repo: IQuestionRepository
    ) {
        this.executor = code_executor;
    }

    async mark(submission: PlayerSubmissionDTO): Promise<boolean> {
        if (!('source_code' in submission)) return false;

        const sub: ProgSubmissionDTO = submission.submission as ProgSubmissionDTO;
        const test_cases = await this.question_repo.getTestCases(submission.question_id);

        if(test_cases.length === 0) throw new Error("No test cases found ");

        for(const test of test_cases){
            const result = await this.executor.execute(sub.source_code, sub.language_id, test.input, test.expected_output);

            if(result.status.id !== 3) return false;
        }

        return true;
       
    }
}