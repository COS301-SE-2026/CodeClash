import { DataSource } from 'typeorm'
import { Users } from '../src/entities/db-entities/user.entities'
import { EloRatings } from '../src/entities/db-entities/elo.entities'
import dotenv from 'dotenv'
import { Questions } from '../src/entities/db-entities/questions.entities'
import { Answers } from '../src/entities/db-entities/answers.entities'
import { Match } from '../src/entities/db-entities/match.entities'
dotenv.config({path: '.env.test'})

const env = process.env

export async function createTestDataSource() {
    const data_source = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: Number(env.DB_PORT),
        username: env.DB_USER!,
        password: env.DB_PASSWORD!,
        database: env.DB_NAME!,
        synchronize: true,
        entities: [EloRatings, Users, Questions, Answers, Match],
        dropSchema: true,
    })

    await data_source.initialize();
    return data_source;
}