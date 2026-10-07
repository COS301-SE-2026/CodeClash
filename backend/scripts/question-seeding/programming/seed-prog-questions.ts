import { pool } from "../db";
import { DEFAULT_TIME_LIMIT, loadExercises, SeedProgrammingQuestion } from "./helper";

async function insertQuestions(questions: SeedProgrammingQuestion[]) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        // Skip questions that are already seeded so the script can be re-run safely
        const existing = await client.query(
            `SELECT title FROM questions WHERE match_mode = 'programming'`
        );
        const seeded_titles = new Set<string>(existing.rows.map((row) => row.title));

        for (const q of questions) {
            if (seeded_titles.has(q.title)) continue;

            const result = await client.query(
                `INSERT INTO questions (match_mode, difficulty, title, description, time_limit, answer_format, answer_precision, input_type)
                VALUES ('programming', $1, $2, $3, $4, NULL, NULL, 'code')
                RETURNING question_id`,
                [q.difficulty, q.title, q.description, DEFAULT_TIME_LIMIT]
            );

            const question_id = result.rows[0].question_id;

            for (let i = 0; i < q.test_cases.length; i++) {
                const test = q.test_cases[i];

                await client.query(
                    `INSERT INTO test_cases (question_id, input, expected_output, is_sample, ordinal)
                    VALUES ($1,$2,$3,$4,$5)`,
                    [
                        question_id,
                        JSON.stringify(test!.input),
                        JSON.stringify(test!.expected),
                        i === 0,
                        i
                    ]
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
    const questions = loadExercises();

    await insertQuestions(questions);
    await pool.end();
}

main().catch((error) => {
    console.error("Seeding failed", error);
    process.exit(1);
})
