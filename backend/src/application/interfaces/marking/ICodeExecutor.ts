import { ProgSubmissionResult } from "src/entities/dtos/submissions/submission-result.dto";

export interface ICodeExecutor{
    execute(source_code: string, language_id: number, stdin: string | null, expected_output: string): Promise<ProgSubmissionResult>;
}