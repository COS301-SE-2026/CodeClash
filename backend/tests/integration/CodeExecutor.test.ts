import { CodeExecutor } from "../../src/interface-adapters/CodeExecutor"
import { describe, expect, test } from "vitest"
import dotenv from 'dotenv'
dotenv.config();


const executor = new CodeExecutor(process.env.JUDGE_0_URL!, process.env.JUDGE_0_TOKEN!);

const source_code =
    'class GfG {' +
    ' static String reverseString(String s) {' +
    ' StringBuilder res = new StringBuilder();' +
    'for (int i = s.length() - 1; i >= 0; i--) {' +
    'res.append(s.charAt(i));' +
    '}' +
    'return res.toString();' +
    '}' +

    'public static void main(String[] args) {' +
    'String s = "abcdef";' +
    'String res = reverseString(s);' +
    'System.out.print(res);' +
    '}' +
    '}'

const lang_id = 62  // java

const stdin = null;

const expected_output = "fedcba";

describe("Tests Judge0 Integration Into Backend", () => {

    test("Creates submission", async () => {
        const expected_result = {
            output: '',
            error: '',
            status_id: '',
            compile_output: ''
        }

        const submission = await executor.execute(source_code, lang_id, stdin, expected_output);

        expect(submission.output).toBe(expected_result.output);

    })
})