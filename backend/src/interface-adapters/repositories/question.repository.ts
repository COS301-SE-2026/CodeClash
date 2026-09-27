import { IQuestionRepository } from "src/application/interfaces/repositories/IQuestionRepository";
import { Questions } from "src/entities/database/questions.entities";
import { QuestionDTO } from "src/entities/dtos/questions/question.dto";
import { Repository } from "typeorm";
import { MatchMode } from "src/entities/dtos/matches/match.dto";

export class QuestionRepository implements IQuestionRepository {
    constructor(
        private readonly questionRepository: Repository<Questions>
    ) { }

    async getRandQuestions(count: number, difficulty: number, match_mode: MatchMode): Promise<QuestionDTO[]> {
        const questions = await this.questionRepository.createQueryBuilder('q')
            .where("q.difficulty = :difficulty", { difficulty: difficulty })
            .andWhere('q.match_mode = :match_mode', { match_mode: match_mode })
            .take(count)
            .orderBy('Random()')
            .getMany()


        const data: QuestionDTO[] = [];

        for (const question of questions) {
            const d: QuestionDTO = {
                id: question.question_id,
                match_mode: question.match_mode,
                difficulty: question.difficulty,
                description: question.description,
                time_limit: question.time_limit,
                title: question.title,
                input_type: question.input_type
            }

            data.push(d)
        }

        return data
    }


}