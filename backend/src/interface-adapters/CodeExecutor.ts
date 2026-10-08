import { ICodeExecutor } from 'src/application/interfaces/marking/ICodeExecutor'
import axios from 'axios'
import dotenv from 'dotenv'
import { ProgSubmissionResult } from 'src/entities/dtos/submissions/submission-result.dto';
dotenv.config();

export class CodeExecutor implements ICodeExecutor {
    // these can be updated as needed
    private readonly memory_limit = Number(process.env.JUDGE_0_MEMORY_LIMIT ?? 128000);
    private readonly stack_limit = 128000;
    private readonly max_file_size = 1024;
  
    private readonly timeout_ms = Number(process.env.JUDGE_0_TIMEOUT_MS ?? 30000); // for judge0 so that unreachable doesnt hang for like 2+ minutes

    constructor() { }

    async execute(source_code: string, language_id: number, stdin: string | null, expected_output: string): Promise<ProgSubmissionResult> {

        // !!!! Submission queue can be full, we need to plan for this
        const data = {
            source_code: Buffer.from(source_code).toString('base64'),
            language_id: language_id,
            stdin: stdin ? Buffer.from(stdin).toString('base64') : null,
            expected_output: Buffer.from(expected_output).toString('base64'),
            memory_limit: this.memory_limit,
            stack_limit: this.stack_limit,
            max_file_size: this.max_file_size
        }

        try {
            const result = await axios.post(`${process.env.JUDGE_0_URL}/submissions?wait=true&base64_encoded=true`, data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Auth-Token": process.env.JUDGE_0_TOKEN
                  },
                  timeout: this.timeout_ms
                });

            return result.data;
        }
        catch (error) {
          // Judge0 reports compile errors inside a normal response, so an error here means Judge0 itself failed (unreachable, auth, full queue).
          // Throwing keeps the player from being marked wrong and losing life for it
          console.error('Judge0 request failed:', axios.isAxiosError(error) ? (error.response?.status ?? error.code) : error);
          throw new Error('Error Marking Submission');
        }
    }
}