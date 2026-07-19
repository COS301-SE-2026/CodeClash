import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv'
dotenv.config()

import { User } from "../db-entities/user.entity"


const env = process.env;

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: Number(env.DB_PORT!),
    username: env.DB_USER!,
    password: env.DB_PASSWORD!,
    database: env.DB_NAME!,
    synchronize: true,
    logging: true,
    entities: [
        User
    ],
    migrations: [],
    subscribers: [],
})
