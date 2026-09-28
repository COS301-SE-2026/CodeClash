import { Pool } from "pg";
import dotnev from "dotenv"
import { findStubFile, LANGUAGES, titleToSlug } from "./helper";
import path from "node:path";
import fs from "fs"
dotnev.config({ path: ".env.dev" })

const env = process.env;

const pool = new Pool({
    host: "localhost",
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});

async function getQuestionsByTitle() {
    const result = await pool.query(
        `SELECT question_id, title FROM questions WHERE match_mode = 'programming'`
    );

    const map = new Map<string, string>();
    for (const row of result.rows) {
        map.set(titleToSlug(row.title), row.question_id);
    }

    return map;
}

async function insertTemplates(questions_by_slug: Map<string, string>) {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        for (const lang of LANGUAGES) {
            const practice_dir = path.join(__dirname, lang.repo_path, "exercises", "practice");
            if (!fs.existsSync(practice_dir)) continue;

            const slugs = fs.readdirSync(practice_dir).filter((entry) =>
                fs.statSync(path.join(practice_dir, entry)).isDirectory()
            );

            for (const slug of slugs) {
                const question_id = questions_by_slug.get(slug);
                if (!question_id) continue;

                const exercise_dir = path.join(practice_dir, slug);
                const stub_path = findStubFile(exercise_dir, slug, lang.stub_extension!);
                if (!stub_path) continue;

                const starter_code = fs.readFileSync(stub_path, "utf-8");

                await client.query(
                    `INSERT INTO programming_templates (question_id, language, judge0_language_id, starter_code)
                    VALUES ($1,$2,$3,$4)
                    ON CONFLICT (question_id,language) DO UPDATE SET starter_code = EXCLUDED.starter_code`,
                    [question_id, lang.language, lang.judge0_id, starter_code]
                );
            }
        }

        await client.query("COMMIT");

    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}


async function main() {
    const questions_by_slug = await getQuestionsByTitle();
    await insertTemplates(questions_by_slug);
    await pool.end();
}

main().catch((error) => {
    console.error("Template seeding failed", error);
    process.exit(1);
})
