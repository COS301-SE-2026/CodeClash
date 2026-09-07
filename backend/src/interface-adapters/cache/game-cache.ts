import Redis from "ioredis";
import { IGameCache } from "src/application/interfaces/cache/IGameCache";
import { AnswerDTO } from "src/entities/dtos/answer.dto";



export class GameCache implements IGameCache {
    constructor(
        private readonly redis: Redis
    ) { }

    async saveGame(game_id: number, player_ids: string[], question_ids: string[]): Promise<void> {
        this.redis.set(`game:${game_id}`, JSON.stringify({ players: player_ids, questions: question_ids }))
    }

    // correct answers
    async saveAnswer(answer: AnswerDTO): Promise<void> {
        this.redis.set(`question:${answer.question_id}`, JSON.stringify(answer))

    }

    async getAnswer(question_id: string): Promise<AnswerDTO | null> {
        const cached = await this.redis.get(`question:${question_id}`);

        if (!cached) return null;

      try {
        return JSON.parse(cached) as AnswerDTO;
      } catch {
        return null;
        }
    }
}