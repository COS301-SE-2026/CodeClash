import "reflect-metadata"
import { join } from "path"

import dotenv from 'dotenv'
import { DataSource } from "typeorm"
dotenv.config()

const env = process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST!,
    port: Number(env.DB_PORT!),
    username: env.DB_USER!,
    password: env.DB_PASSWORD!,
    database: env.DB_NAME!,
    synchronize: true,
    logging: ["warn", "error"],
    entities: [join(__dirname, "..", "..", "entities", "db-entities", "*.{js,ts}")],
    migrations: [],
    subscribers: [],
})
