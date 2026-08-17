

export interface ExecutionResult{
    output: string | null,
    error: string | null,
    status_id: number,
    time: string | null,
    memory: number | null,
    compile_output: string | null
}

export interface ICodeExecutor{
    execute(source_code: string, language_id: number, stdin: string): Promise<ExecutionResult>;
}