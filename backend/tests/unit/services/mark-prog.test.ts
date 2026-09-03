import { describe, expect, it, vi } from 'vitest'
import { CodeExecutor } from '../../../src/interface-adapters/CodeExecutor'
import { MarkProg } from '../../../src/application/usecases/services/marking/mark-prog'
import { ProgSubmissionDTO } from '../../../src/entities/dtos/components.dto'



const submission: ProgSubmissionDTO = {
    source_code: 'source-code-01',
    language_id: 1,
    stdin: null
}

describe('Testing Programming Marker', () => {
    it("Sends test to code executor", async () => {
        const executor = {
            execute: vi.fn().mockResolvedValue({
                stdout: "hello, Judge0\n",
                time: "0.001",
                memory: 376,
                stderr: null,
                token: "8531f293-1585-4d36-a34c-73726792e6c9",
                compile_output: null,
                message: null,
                status: {
                    id: 3,
                    description: "Accepted"
                }
            })
        };
        const prog_marker = new MarkProg(executor);

        await prog_marker.mark(submission, 'correct-answer-01');

        expect(executor.execute).toHaveBeenCalledWith(submission.source_code, submission.language_id, submission.stdin, 'correct-answer-01');
    })
})