import "reflect-metadata"
import dotenv from 'dotenv'
import { DataSource } from "typeorm"
import { Matches, MatchLog, MatchProblems } from "src/entities/database/match.entities";
import { Answers } from "src/entities/database/answers.entities";
import { EloHistory, EloRatings } from "src/entities/database/elo.entities";
import { Questions } from "src/entities/database/questions.entities";
import { Submission } from "src/entities/database/submission.entities";
import { Users } from "src/entities/database/user.entities";
import { Achievement } from "src/entities/database/achievement.entities";
import { MatchStats } from "src/entities/database/match-stats.entities";
import { FriendInvite, Friendship } from "src/entities/database/friendship.entities";
import { ShopItem } from "src/entities/database/shop-item.entities";
import { Wallet } from "src/entities/database/wallet.entities";
import { UserItem } from "src/entities/database/user-item.entities";
import { EquippedItems } from "src/entities/database/equipped-items.entities";

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
        Friendship,
        FriendInvite,
        ShopItem,
        Wallet,
        UserItem,
        EquippedItems
    ],
    migrations: [],
    subscribers: [],
    ssl: env.NODE_ENV === 'production'? {rejectUnauthorized: false}: false
})
