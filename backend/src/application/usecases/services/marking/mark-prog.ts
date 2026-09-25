import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy, MarkOutcome } from "src/application/interfaces/marking/IMarkingStategy";
import { ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { AnswerDTO } from "src/entities/dtos/questions/answer.dto";
import { ProgSubmissionResult } from "src/entities/dtos/submissions/submission-result.dto";

export class MarkProg implements IMarkingStrategy {

    private readonly executor;

    constructor(private readonly code_executor: ICodeExecutor) {
        this.executor = code_executor;
    }

  async mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<MarkOutcome> {
      if (!('source_code' in submission)) return { correct: false };
    const result: ProgSubmissionResult = await this.executor.execute(submission.source_code, submission.language_id, submission.stdin, answer.answer);

    const seconds = Number.parseFloat(result.time); // judge0 time in seconds as string and memory in bytes
    const memory = result.memory; // memory in bytes

    return {
        correct: result.status.id === 3,
        run_time_ms: Number.isFinite(seconds) ? seconds * 1000 : null,
        memory_kb: memory || null
    };
    }
}