
import { CodeExecutor } from "../../src/interface-adapters/CodeExecutor"
import { describe, it } from "vitest"
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
    'String s = "abdcfe";' +
    'String res = reverseString(s);' +
    'System.out.print(res);' +
    '}' +
    '}'

const lang_id = 62  // java

describe("Tests Judge0 Integration Into Backend", () => {

})