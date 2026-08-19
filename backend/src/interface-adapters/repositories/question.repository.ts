import { IQuestionRepository } from "src/application/interfaces/repositories/IQuestionRepository";
import { GameMode, Questions } from "src/entities/db-entities/questions.entities";
import { QuestionDTO } from "src/interface-adapters/dtos/question.dto";
import { Repository } from "typeorm";

export class QuestionRepository implements IQuestionRepository {
    constructor(
        private readonly questionRepository: Repository<Questions>
    ) { }

    async getRandQuestions(count: number, difficulty: number, game_mode: GameMode): Promise<QuestionDTO[]> {
        const questions = await this.questionRepository.createQueryBuilder('q')
            .where("q.difficulty = :difficulty", { difficulty: difficulty })
            .andWhere('q.game_mode = :game_mode', { game_mode: game_mode })
            .take(count)
            .orderBy('Random()')
            .getMany()


        const data: QuestionDTO[] = [];

        for (const question of questions) {
            const d: QuestionDTO = {
                id: question.question_id,
                category: question.game_mode,
                difficulty: question.difficulty,
                description: question.description,
                time_limit: question.time_limit,
                title: question.title
            }

            data.push(d)
        }

        return data
    }


}