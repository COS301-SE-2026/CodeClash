import { PlayerSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { IQuestionRepository } from "src/application/interfaces/repositories/IQuestionRepository";

export class MarkProg implements IMarkingStrategy {

    private readonly executor;
    // Max test cases sent to Judge0 at once; keeps a single submission from flooding its queue
    private static readonly CONCURRENCY = 8;

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

        if (test_cases.length === 0) throw new Error("No test cases found");

        // Judge0 runs submissions in parallel, so send test cases in batches instead of one at a time
        // (each run is a full compile + execute, which made sequential marking take tens of seconds)
        for (let i = 0; i < test_cases.length; i += MarkProg.CONCURRENCY) {
            const batch = test_cases.slice(i, i + MarkProg.CONCURRENCY);
            const results = await Promise.all(batch.map((test) =>
                this.executor.execute(sub.source_code, sub.language_id, this.formatStdin(test.input), test.expected_output)
            ));

            if (results.some((result) => result.status.id !== 3)) return false;
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

        return Object.values(parsed as Record<string, unknown>).map(String).join(' ');
    }
}