import { CodeExecutor } from "../../../src/interface-adapters/CodeExecutor"
import { describe, expect, test } from "vitest"
import dotenv from 'dotenv'
dotenv.config();


const executor = new CodeExecutor();


describe("Tests Judge0 Integration Into Backend", () => {

    test("Creates submission", async () => {
        const source_code = `
            #include <iostream>
            #include <string>
            #include <algorithm>
            using namespace std;

            int main() {
                string str = "abcdef";

                reverse(str.begin(), str.end());

                cout << str;

                return 0;
            }
            `
        const lang_id = 52  // C++
        const stdin = null;

        const expected_output = "fedcba";

        const submission = await executor.execute(source_code, lang_id, stdin, expected_output);

        expect(submission.status.id).toBe(3);
        expect(Buffer.from(submission.stdout,'base64').toString('utf-8')).toBe(expected_output);

    });

    test("Marks incorrect submissions wrong", async () => {
        const source_code = `
            #include <iostream>
            #include <string>
            #include <algorithm>
            using namespace std;

            int main() {
                string str = "abcdef"

                cout << str;

                return 0;
            }
            `
        const lang_id = 52  // C++
        const stdin = null;

        const submission = await executor.execute(source_code, lang_id, stdin, "error");

        expect(submission.status.id).toBe(6);
        expect(submission.status.description).toBe("Compilation Error");
    })

})