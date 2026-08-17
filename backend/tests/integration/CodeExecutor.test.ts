
import {CodeExecutor} from "../../src/interface-adapters/CodeExecutor"
import {describe, it} from "vitest"
import dotenv from 'dotenv'
dotenv.config();



const executor = new CodeExecutor(process.env.JUDGE_0_URL!, process.env.JUDGE_0_TOKEN!);

describe("Tests Judge0 Integration Into Backend", ()=>{

})