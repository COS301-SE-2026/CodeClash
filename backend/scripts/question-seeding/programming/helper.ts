import "dotenv/config";
import path from "node:path";
import fs from "node:fs";


const REPO_PATH = "../../problem-specifications";
export const EXERCISES_DIR = path.join(__dirname, REPO_PATH, "exercises");

const DIFFICULTY_SOURCE_CONFIG = path.join(__dirname, "../../python/config.json");

export const DEFAULT_TIME_LIMIT = "10:00";

function mapDifficulty(excercism_difficulty: number) {
    const scaled = Math.round(((excercism_difficulty - 1) / 9) * 23) + 1;
    return Math.min(24, Math.max(1, scaled));
}

export function loadDifficulty() {
    const map = new Map<string, number>();

    if (!fs.existsSync(DIFFICULTY_SOURCE_CONFIG)) return map;

    const config = JSON.parse(fs.readFileSync(DIFFICULTY_SOURCE_CONFIG, "utf-8"));

    for (const ex of config.exercises.practice) {
        if (ex.slug && typeof ex.difficulty === "number")
            map.set(ex.slug, mapDifficulty(ex.difficulty));
    }
    return map;
}

type TestCase = {
    input: unknown,
    expected: unknown
};

export type SeedProgrammingQuestion = {
    title: string,
    description: string,
    test_cases: TestCase[],
    difficulty: number
}

function getTitle(slug: string) {
    return slug.split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function flattenCases(cases: any[]): TestCase[] {
    const result: TestCase[] = [];

    for (const c of cases) {
        if (Array.isArray(c.cases)) {
            result.push(...flattenCases(c.cases));
        }
        else if ("input" in c && "expected" in c) {
            result.push({ input: c.input, expected: c.expected });
        }
    }

    return result;
}

export function loadExercises(): SeedProgrammingQuestion[] {
    const slugs = fs.readdirSync(EXERCISES_DIR).filter((entry) => {
        const stat = fs.statSync(path.join(EXERCISES_DIR, entry));
        return stat.isDirectory();
    });

    const difficulty_map = loadDifficulty();

    const questions: SeedProgrammingQuestion[] = [];

    for (const slug of slugs) {
        const dir = path.join(EXERCISES_DIR, slug);
        const description_path = path.join(dir, "description.md");
        const canonical_path = path.join(dir, "canonical-data.json");

        if (!fs.existsSync(description_path) || !fs.existsSync(canonical_path)) continue;

        const description = fs.readFileSync(description_path, "utf-8").trim();
        if (!description) continue;
        
        const difficulty = difficulty_map.get(slug);
        if(difficulty === undefined) continue;

        let canonical: any;

        try {
            canonical = JSON.parse(fs.readFileSync(canonical_path, "utf-8"));
        } catch {
            continue;
        }

        const test_cases = flattenCases(canonical.cases ?? []);
        if (test_cases.length === 0) continue;

        questions.push({
            title: getTitle(slug),
            description,
            test_cases,
            difficulty
        });

    }
    return questions;
}


export const LANGUAGES = [
    {
        language: "python",
        repo_path: '../../python',
        stub_extension: ["py"],
        judge0_id: 71
    },
    {
        language: "cpp",
        repo_path: "../../cpp",
        stub_extension: ["cpp", "h"],
        judge0_id: 54
    }
]

export function titleToSlug(title: string) {
    return title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

function slugToPascalCase(slug: string) {
    return slug.split("-")
        .map((word) => word.charAt(0).toUpperCase + word.slice(1))
        .join("");
}

export function findStubFile(exercise_dir: string, slug: string, extension: string[]) {
    const name_variants = [
        slug,
        slug.replaceAll("-", "_"),
        slugToPascalCase(slug)
    ];

    for(const ext of extension){
        for(const name of name_variants){
            const full = path.join(exercise_dir, `${name}.${ext}`);

            if(fs.existsSync(full)) return full;
        }
    }

    return null;
}
