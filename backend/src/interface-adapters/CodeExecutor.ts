import { ICodeExecutor } from 'src/application/interfaces/marking/ICodeExecutor'
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config();

export class CodeExecutor implements ICodeExecutor {
    // these can be updated as needed
    private readonly memory_limit = 128000;
    private readonly stack_limit = 128000;
    private readonly max_file_size = 1024;

    constructor() { }

    async execute(source_code: string, language_id: number, stdin: string | null, expected_output: string): Promise<string> {

        // !!!! Submission queue can be full, we need to plan for this
        const data = JSON.stringify({
            "source_code": source_code,
            "language_id": language_id,
            "stdin": stdin,
            "expected_output": expected_output,
            "memory_limit": this.memory_limit,
            "stack_limit": this.stack_limit,
            "max_file_size": this.max_file_size,
            "callback_url": process.env.JUDGE_0_CALLBACK
        })

        const result = await axios.post(`${process.env.JUDGE_0_URL}/submissions?wait=false&base64_encoded=true`, data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-Token": process.env.JUDGE_0_TOKEN
                }
            });

        if (result.status !== 201)
            throw new Error("Error Marking Submission");


        return result.data.token;
    }
}