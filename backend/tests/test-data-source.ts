import { DataSource } from 'typeorm'
import { Users } from '../src/entities/database/user.entities'
import { EloRatings,EloHistory } from '../src/entities/database/elo.entities'
import dotenv from 'dotenv'
import { Questions } from '../src/entities/database/questions.entities'
import { Answers } from '../src/entities/database/answers.entities'
import { Matches,MatchLog, MatchProblems } from '../src/entities/database/match.entities'
import { Submission } from '../src/entities/database/submission.entities'
import { Achievement } from '../src/entities/database/achievement.entities'
import { MatchStats } from '../src/entities/database/match-stats.entities'
import { ShopItem } from '../src/entities/database/shop-item.entities'
import { EquippedItems } from '../src/entities/database/equipped-items.entities'
import { Wallet } from '../src/entities/database/wallet.entities';
import { UserItem } from '../src/entities/database/user-item.entities';

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
            MatchLog,
            MatchProblems,
            Answers,
            EloRatings,
            EloHistory,
            Questions,
            Submission,
            Users,
            Achievement,
            MatchStats,
            ShopItem,
            Wallet,
            UserItem,
            EquippedItems
        ],
        dropSchema: true,
    })

    await data_source.initialize();
    return data_source;
}