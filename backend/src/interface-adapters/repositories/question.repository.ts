import { IQuestionRepository } from "src/application/interfaces/IQuestionRepository";
import { Questions } from "src/entities/db-entities/questions.entities";
import { Repository } from "typeorm";
import { QuestionDTO } from "src/entities/dtos/question.dto";

export class QuestionRepository implements IQuestionRepository {
    constructor(
        private questionRepository: Repository<Questions>
    ) { }

    async getRandQuestions(count: number, difficulty: number, game_mode: "Maths" | "Prog"): Promise<QuestionDTO[] | null> {
        const questions = await this.questionRepository.createQueryBuilder()
            .select()
            .from(Questions, 'q')
            .where("q.difficulty = :difficulty", { difficulty: difficulty })
            .andWhere('q.game_mode = :game_mode', { game_mode: game_mode })
            .take(count)
            .orderBy('Random()')
            .getMany()

        return questions
    }


}