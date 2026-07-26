import Redis from "ioredis";
import { IGameCache } from "src/application/interfaces/IGameCache";


export class GameCache implements IGameCache {
    constructor(
        private readonly redis: Redis
    ) { }

    async saveGame(game_id: number, player_ids: string[], question_ids: string[]): Promise<void> {
        this.redis.set(`game:${game_id}`, `players:${player_ids}, questions:${question_ids}`)
    }

    // correct answers
    async saveAnswer(question_id: string, answer: string): Promise<void> {
        this.redis.set(`question:${question_id}`, `answer:${answer}`)
    }

    async getAnswer(question_id: string): Promise<string | null> {
        const answer = await this.redis.get(`question:${question_id}`);

        return answer;
    }
}