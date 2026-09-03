import { ICodeExecutor } from 'src/application/interfaces/marking/ICodeExecutor'
import axios from 'axios'
import dotenv from 'dotenv'
import { SubmissionResult } from 'src/entities/dtos/submission-result.dto';
dotenv.config();

export class CodeExecutor implements ICodeExecutor {
    // these can be updated as needed
    private readonly memory_limit = 128000;
    private readonly stack_limit = 128000;
    private readonly max_file_size = 1024;

    constructor() { }

    async execute(source_code: string, language_id: number, stdin: string | null, expected_output: string): Promise<SubmissionResult> {

        // !!!! Submission queue can be full, we need to plan for this

        const encoded_source = Buffer.from(source_code, 'utf-8').toString('base64');
        const encoded_expected = Buffer.from(expected_output, 'utf-8').toString('base64');
        const encoded_stdin = (stdin) ? Buffer.from(stdin, 'utf-8').toString('base64') : null;

        const data = JSON.stringify({
            "source_code": encoded_source,
            "language_id": language_id,
            "stdin": encoded_stdin,
            "expected_output": encoded_expected,
            "memory_limit": this.memory_limit,
            "stack_limit": this.stack_limit,
            "max_file_size": this.max_file_size
        })

        try {
            const result = await axios.post(`${process.env.JUDGE_0_URL}/submissions?wait=true&base64_encoded=true`, data,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-Auth-Token": process.env.JUDGE_0_TOKEN
                    }
                });

            return result.data;
        }
        catch {
            throw new Error("Error Marking Submission");
        }
    }
}