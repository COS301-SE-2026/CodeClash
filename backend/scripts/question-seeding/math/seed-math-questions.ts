import { Pool } from "pg";
import { containsDiagram, extractAnswer, fetchAllRows, SeedQuestion, transformRow } from "./helpers";
import dotenv from 'dotenv'
dotenv.config({path: ".env.test"});


const env = process.env;

const pool = new Pool({
    host:"localhost",
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});



// INSERTING INTO DB

async function insertQuestions(questions: SeedQuestion[]) {
    const client = await pool.connect();
    let insert = 0;

    try {
        await client.query("BEGIN");
        for (const q of questions) {
            const result = await client.query(
                `INSERT INTO questions (match_mode, difficulty, title, description, time_limit, answer_format, answer_precision, input_type)
                VALUES ($1, $2, $3, $4,$5,$6,$7,$8)
                RETURNING question_id`,
                [
                    q.match_mode,
                    q.difficulty,
                    q.title,
                    q.description,
                    q.time_limit,
                    q.answer_format,
                    q.answer_precision,
                    q.input_type
                ]
            );

            const question_id = result.rows[0].question_id;

            await client.query(
                `INSERT INTO answers (question_id, answer) VALUES ($1, $2)`,
                [question_id, q.correct_answer]
            );
            ++insert;
        }

        await client.query("COMMIT");
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
    return insert;
}


async function main() {
    const raw_rows = await fetchAllRows();

    const questions = raw_rows.map((row) => {
        if (containsDiagram(row.problem)) return null;

        const boxed = extractAnswer(row.solution);
        if (!boxed) return null;

        return transformRow(row);
    }).filter((q): q is SeedQuestion => q !== null);

    await insertQuestions(questions);
    await pool.end();
}

main().catch(error => {
    console.error("Seeding failed", error);
    process.exit(1);
});