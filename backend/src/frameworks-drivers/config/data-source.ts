import "reflect-metadata"
import dotenv from 'dotenv'
import { DataSource } from "typeorm"
import { Matches} from "src/entities/database/match.entities";
import { Answers } from "src/entities/database/answers.entities";
import { EloHistory } from "src/entities/database/elo.entities";
import { Questions } from "src/entities/database/questions.entities";
import { Users } from "src/entities/database/user.entities";
import { Achievement } from "src/entities/database/achievement.entities";
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
    synchronize: false,
    logging: ["warn", "error"],
    entities: [
        Matches,
        Answers,
        EloHistory,
        Questions,
        Users,
        Achievement,
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
