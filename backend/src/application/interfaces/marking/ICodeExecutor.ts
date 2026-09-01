

export interface ExecutionResult{
    output: string | null,
    error: string | null,
    status: {id: number, description: string},
    time: string | null,
    memory: number | null,
    compile_output: string | null,
}

export interface ICodeExecutor{
    execute(source_code: string, language_id: number, stdin: string | null, expected_output: string): Promise<string>;
}