import { ICodeExecutor, ExecutionResult } from 'src/application/interfaces/ICodeExecutor'
import axios from 'axios'

export class CodeExecutor implements ICodeExecutor {
    // these can be updated as needed
    private readonly memory_limit = 128000;
    private readonly stack_limit = 128000;
    private readonly max_file_size = 1024;  

    constructor(
        private readonly url: string,
        private readonly auth: string
    ) { }

    async execute(source_code: string, language_id: number, stdin: string | null, expected_output: string): Promise<ExecutionResult> {

        // !!!! Submission queue can be full, we need to plan for this
        const data = JSON.stringify({
            "source_code": source_code, 
            "language_id":language_id, 
            "stdin":stdin, 
            "expected_output":expected_output,
            "memory_limit":this.memory_limit,
            "stack_limit": this.stack_limit,
            "max_file_size": this.max_file_size
        })

        const result = await axios.post(`${this.url}/submissions?wait=false`, data,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Auth-Token": this.auth
                }
            });

        if (result.status !== 201)
            throw new Error("Error Marking Submission"); 

        const response: ExecutionResult = {
            output: result.data.stdout,
            error: result.data.stderr,
            status_id:result.data.status.id ,
            time:result.data.time ,
            memory:result.data.memory ,
            compile_output:result.data.compile_output
        }
        return response;
    }
}