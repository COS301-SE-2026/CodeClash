import { DataSource } from 'typeorm'
import { Users } from '../src/entities/db-entities/user.entities'
import { EloRatings } from '../src/entities/db-entities/elo.entities'
import dotenv from 'dotenv'
import { Questions } from '../src/entities/db-entities/questions.entities'
import { Answers } from '../src/entities/db-entities/answers.entities'
dotenv.config()

const env = process.env

export async function createTestDataSource() {
    const data_source = new DataSource({
        type: 'postgres',
        host: env.DB_TEST_HOST,
        port: Number(env.DB_TEST_PORT),
        username: env.DB_TEST_USER!,
        password: env.DB_TEST_PASSWORD!,
        database: env.DB_TEST_NAME!,
        synchronize: true,
        entities: [EloRatings, Users, Questions, Answers],
        dropSchema: true,
    })


    await data_source.initialize();
    return data_source;
}