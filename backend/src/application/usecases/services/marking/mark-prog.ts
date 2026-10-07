import { PlayerSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy, MarkOutcome } from "src/application/interfaces/marking/IMarkingStategy";
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

    async mark(submission: PlayerSubmissionDTO): Promise<MarkOutcome> {
   
           if (!submission.submission || !('source_code' in submission.submission)) return { correct: false };
   
           const sub: ProgSubmissionDTO = submission.submission;
           const test_cases = await this.question_repo.getTestCases(submission.question_id);
   
           if (test_cases.length === 0) throw new Error("No test cases found");
   
           let run_time_ms: number | null = null; // slowest test case, judge0 time is seconds as a string
           let memory_kb: number | null = null;
   
           // Judge0 runs submissions in parallel, so send test cases in batches instead of one at a time
           // (each run is a full compile + execute, which made sequential marking take tens of seconds)
           for (let i = 0; i < test_cases.length; i += MarkProg.CONCURRENCY) {
               const batch = test_cases.slice(i, i + MarkProg.CONCURRENCY);
               const results = await Promise.all(batch.map((test) =>
                    this.executor.execute(sub.source_code, sub.language_id, this.formatStdin(test.input), this.formatExpected(test.expected_output))
               ));
   
               for (const result of results) {
                   const seconds = Number.parseFloat(result.time);
                   if (Number.isFinite(seconds)) run_time_ms = Math.max(run_time_ms ?? 0, seconds * 1000);
                   if (result.memory) memory_kb = Math.max(memory_kb ?? 0, result.memory);
               }
   
               if (results.some((result) => result.status.id !== 3)) return { correct: false, run_time_ms, memory_kb };
           }
   
           return { correct: true, run_time_ms, memory_kb };
   
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

  private formatExpected(expected: string) {
    try {
      const parsed = JSON.parse(expected);
      if (typeof parsed === 'string') return parsed;
    }
    catch {
      return expected;
    }
    return expected;
  }
}