import { ICodeExecutor, ExecutionResult } from 'src/application/interfaces/ICodeExecutor'
import axios from 'axios'

export class CodeExecutor implements ICodeExecutor {

    constructor(
        private readonly url: string,
        private readonly auth: string
    ) { }

    async execute(source_code: string, language_id: number, stdin: string): Promise<ExecutionResult> {

        const data = JSON.stringify({
            source_code, language_id, stdin
        })

        const result = await axios.post(`${this.url}/submissions?wait=true`, data,
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