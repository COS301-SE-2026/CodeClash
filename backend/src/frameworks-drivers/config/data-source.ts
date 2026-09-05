import "reflect-metadata"
import dotenv from 'dotenv'
import { DataSource } from "typeorm"
import { Matches, MatchLog, MatchProblems } from "src/entities/db-entities/match.entities";
import { Answers } from "src/entities/db-entities/answers.entities";
import { EloHistory, EloRatings } from "src/entities/db-entities/elo.entities";
import { Questions } from "src/entities/db-entities/questions.entities";
import { Submission } from "src/entities/db-entities/submission.entities";
import { Users } from "src/entities/db-entities/user.entities";
import { Achievement } from "src/entities/db-entities/achievement.entities";
import { MatchStats } from "src/entities/db-entities/match-stats.entities";
import { FriendInvite, Friendship } from "src/entities/db-entities/friendship.entities";

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
        FriendInvite
    ],
    migrations: [],
    subscribers: [],
})
