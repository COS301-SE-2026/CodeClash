import Redis from "ioredis";
import { IMatchCache } from "src/application/interfaces/cache/IMatchCache";
import { AnswerDTO } from "src/entities/dtos/match/answer.dto";



export class MatchCache implements IMatchCache {
    constructor(
        private readonly redis: Redis
    ) { }

    async saveMatch(match_id: number, player_ids: string[], question_ids: string[]): Promise<void> {
        await this.redis.set(`match:${match_id}`, JSON.stringify({ players: player_ids, questions: question_ids }))
    }

    // correct answers
    async saveAnswer(answer: AnswerDTO): Promise<void> {
        await this.redis.set(`question:${answer.question_id}`, JSON.stringify(answer))

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