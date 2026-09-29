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

        if (!submission.submission || !('source_code' in submission.submission)) return false;

        const sub: ProgSubmissionDTO = submission.submission;
        const test_cases = await this.question_repo.getTestCases(submission.question_id);

        if (test_cases.length === 0) throw new Error("No test cases found ");

        for (const test of test_cases) {
            const stdin = this.formatStdin(test.input);
            const result = await this.executor.execute(sub.source_code, sub.language_id, stdin, test.expected_output);

            if (result.status.id !== 3) return false;
        }

        return true;

    }


    private formatStdin(input: string) {
        let parsed;

        try {
            parsed = JSON.parse(input);
        }
        catch {
            return input;
        }

        if (parsed === null || typeof parsed !== 'object') {
            return String(parsed);
        }

        return Object.values(parsed as Record<string, unknown>).map((v) => String(v)).join(' ');
    }
}