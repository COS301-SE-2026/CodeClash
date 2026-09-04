<<<<<<< HEAD
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
=======
import Redis from "ioredis";
import { IGameCache } from "src/application/interfaces/cache/IGameCache";


export class GameCache implements IGameCache {
    constructor(
        private readonly redis: Redis
    ) { }

    async saveGame(game_id: number, player_ids: string[], question_ids: string[]): Promise<void> {
        this.redis.set(`game:${game_id}`, JSON.stringify({ players: player_ids, questions: question_ids }))
    }

    // correct answers
    async saveAnswer(question_id: string, answer: string): Promise<void> {
        this.redis.set(`question:${question_id}`, `answer:${answer}`)

    }

    async getAnswer(question_id: string): Promise<string | null> {
        const answer = await this.redis.get(`question:${question_id}`);

        if (!answer) return null;

        return answer.split(":")[1]!;
    }
>>>>>>> 5378a30cd86c953bdc20aa94765d31b947e8a4e4
}