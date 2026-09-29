import { MathsSubmissionDTO, ProgSubmissionDTO } from "src/entities/dtos/submissions/submission.dto";
import { IMarkingStrategy } from "src/application/interfaces/marking/IMarkingStategy";
import { ICodeExecutor } from "src/application/interfaces/marking/ICodeExecutor";
import { AnswerDTO } from "src/entities/dtos/questions/answer.dto";
import { ProgSubmissionResult } from "src/entities/dtos/submissions/submission-result.dto";

export class MarkProg implements IMarkingStrategy {

    private readonly executor;

    constructor(private readonly code_executor: ICodeExecutor) {
        this.executor = code_executor;
    }

  async mark(submission: MathsSubmissionDTO | ProgSubmissionDTO, answer: AnswerDTO): Promise<boolean> {
      if (!('source_code' in submission)) return false;
        const result: ProgSubmissionResult = await this.executor.execute(submission.source_code, submission.language_id, submission.stdin, answer.answer);

        return result.status.id === 3;
    }
}