import axios from "axios";
import { describe, it, expect, vi } from "vitest";
import { CodeExecutor } from '../../../src/interface-adapters/CodeExecutor'
import { stderr } from "node:process";

vi.mock('axios');

describe("Testing Code Executor", () => {
    const executor = new CodeExecutor();

    it("Sends submission to judge0", async () => {
        vi.mocked(axios.post).mockResolvedValue({
            data: {
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
            }

        })


        const result = await executor.execute('print("hello, Judge0")', 71, null, 'hello, Judge0');

        expect(axios.post).toHaveBeenCalled();
        expect(result.status.description).toBe('Accepted')
    })

    it("throws an error when judge0 fails", async () => {
        vi.mocked(axios.post).mockRejectedValue(new Error());


        await expect(executor.execute('print("hello, Judge0")', 711, null, 'hello, Judge0')).rejects.toThrow("Error Marking Submission")
    })

    it("return compilation error when an axios error occurs", async () => {
        const axios_error = {
            response: {
                data: {
                    stderr: "AXIOS ERROR",
                    compile_output: "an axiso error has occured"
                }
            }
        }

        vi.mocked(axios.isAxiosError).mockReturnValue(true);
        vi.mocked(axios.post).mockRejectedValue(axios_error);

        const result = await executor.execute('print("hello, Judge0")', 71, null, 'hello, Judge0');

        expect(result.status.id).toBe(6);
        expect(result.status.description).toBe('Compilation Error');
    })
})