import { normalize, safeParse, splitTopLevel } from '../../../src/application/usecases/services/marking/maths-marking/normalizer'
import axios from 'axios'


const API_URL = "https://datasets-server.huggingface.co/rows";
const DATASET = "qwedsacf/competition_math";
const CONFIG = "default";
const SPLIT = "train";
const PAGE_SIZE = 100;
const MAX_ROWS = 500;

type HFRow = {
    problem: string,
    level: string,
    type: string,
    solution: string
};

export type SeedQuestion = {
    match_mode: "math",
    difficulty: number,
    title: string,
    description: string,
    time_limit: string,
    answer_format: "numeric" | "decimal" | "set" | "variables" | "expression" | "equation",
    answer_precision: null,
    input_type: "short_text" | "long_text",
    correct_answer: string
}


// Fetching Data

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchAllRows(): Promise<HFRow[]> {
    let offset = 0;
    const rows: HFRow[] = [];

    while (true) {
        const params = new URLSearchParams({
            dataset: DATASET,
            config: CONFIG,
            split: SPLIT,
            offset: String(offset),
            length: String(PAGE_SIZE)
        });

        let data: any;
        let attempt = 0;

        while (true) {
            try {
                const res = await axios.get(`${API_URL}?${params.toString()}`);
                data = res.data;
                break;
            } catch (error: any) {

                const status = error.response.status;
                const retry = status === 429 && status >= 500 || ['ECONNRESET', 'ETIMEDOUT', 'EAI_AGAIN'].includes(error.code);

                if (retry && attempt < 5) {
                    const backoff = 2000 * Math.pow(2, attempt);
                    await sleep(backoff);
                    attempt++;
                    continue;
                }
                throw error;
            }
        }

        if (!data.rows || data.rows.length === 0) break;
        rows.push(...data.rows.map((r: { row: HFRow }) => r.row));
        offset += PAGE_SIZE;
        if (rows.length >= (data.num_rows_total ?? Infinity)) break;
        if (rows.length >= MAX_ROWS) break;

        await sleep(300);
    }
    return rows;
}


// Helpers 

export function extractAnswer(solution: string) {
    const marker = "\\boxed{";
    const start = solution.lastIndexOf(marker);

    if (start === -1) return null;

    let depth = 0;
    let content = "";

    for (let i = start + marker.length; i < solution.length; i++) {
        const char = solution[i];

        if (char === "{") depth++;
        else if (char === "}") {
            if (depth === 0) break;
            depth--;
        }

        content += char;
    }

    return content.trim();
}

export function containsDiagram(problem: string) {
    return problem.includes("[asy]") || problem.includes("[/asy]");
}

function levelToDifficulty(level: string) {
    const n = Math.min(5, Math.max(1, parseInt(level.replace("Level ", ""), 10) || 3));
    const start = Math.round(((n - 1) * 24) / 5) + 1;
    const end = Math.round((n * 24) / 5);
    return start + Math.floor(Math.random() * (end - start + 1));
}

function getTimeLimit(difficulty: number) {
    const seconds = Math.round(60 + (difficulty - 1) * ((300 - 60) / 23));

    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
}

const ASSIGNMENT_NAME = /^[a-z][a-z0-9]*$/;


function classifyAndValidate(raw_answer: string) {
    const normalized = normalize(raw_answer);
    if (normalized === "") return null;

    const parts = splitTopLevel(normalized, ",");


    // VARIABLES
    if (parts.length > 1 && parts.every((p => splitTopLevel(p, "=").length === 2))) {
        const valid = parts.every(p => {
            const [name, value] = splitTopLevel(p, "=");
            return ASSIGNMENT_NAME.test(name!.toLowerCase()) && safeParse(value!) !== null;
        });

        return valid ? "variables" : null;
    }

    // SETS
    if (parts.length > 1) {
        const valid = parts.every(p => safeParse(p) !== null);

        return valid ? "set" : null;
    }


    // EQUATION
    const eq_parts = splitTopLevel(normalized, "=");
    if (eq_parts.length === 2) {
        const valid = safeParse(eq_parts[0]!) !== null && safeParse(eq_parts[1]!) !== null;
        return valid ? "equation" : null;
    }


    // expression
    if (safeParse(normalized) === null) return null;
    if (/^-?\d+$/.test(normalized)) return "numeric";
    if (/^-?\d+\.\d+$/.test(normalized)) return "decimal";

    return "expression";
}

function inputTypeFormat(format: SeedQuestion["answer_format"]) {
    return (format === "numeric" || format === "decimal") ? "short_text" : "long_text";
}

export function transformRow(row: HFRow): SeedQuestion | null {
    if (containsDiagram(row.problem)) return null;

    const answer = extractAnswer(row.solution);
    if (!answer) return null;

    const answer_format = classifyAndValidate(answer);
    if (!answer_format) return null;

    const difficulty = levelToDifficulty(row.level);

    return {
        match_mode: "math",
        difficulty,
        title: `${row.type} - ${row.level}`,
        description: row.problem,
        time_limit: getTimeLimit(difficulty),
        answer_format,
        answer_precision: null,
        input_type: inputTypeFormat(answer_format),
        correct_answer: answer
    };
}

