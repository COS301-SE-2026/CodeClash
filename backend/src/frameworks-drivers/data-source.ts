import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv'
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
    entities: ["src/interface-adapters/repositories/db-entities/*.ts" ],
    migrations: [],
    subscribers: [],
})
