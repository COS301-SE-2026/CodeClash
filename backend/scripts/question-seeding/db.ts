import { Pool } from "pg";
import dotenv from "dotenv";
import path from "node:path";

// Load backend/.env.dev regardless of the directory the script is run from
dotenv.config({ path: path.join(__dirname, "../../.env.dev") });

const env = process.env;

// The seed scripts run on the host, where the dev compose publishes postgres on 5433.
// Override with SEED_DB_HOST/SEED_DB_PORT (e.g. SEED_DB_HOST=db SEED_DB_PORT=5432 inside the backend container).
export const pool = new Pool({
    host: env.SEED_DB_HOST ?? "localhost",
    port: Number(env.SEED_DB_PORT ?? 5433),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME
});
