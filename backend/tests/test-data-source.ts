import { DataSource } from 'typeorm'
import { Users } from '../src/entities/database/user.entities'
import { EloHistory } from '../src/entities/database/elo.entities'
import dotenv from 'dotenv'
import { Questions } from '../src/entities/database/questions.entities'
import { Answers } from '../src/entities/database/answers.entities'
import { Matches} from '../src/entities/database/match.entities'
import { Achievement } from '../src/entities/database/achievement.entities'


dotenv.config({ path: '.env.test' })

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
        entities: [
            Matches,
            Answers,
            EloHistory,
            Questions,
            Users,
            Achievement,
        ],
        dropSchema: true,
    })

    await data_source.initialize();
    return data_source;
}