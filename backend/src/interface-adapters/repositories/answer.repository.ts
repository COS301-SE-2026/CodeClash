import { IAnswerRepository } from "src/application/interfaces/repositories/IAnswerRepository";
import { Answers } from "src/entities/db-entities/answers.entities";
import { Repository } from "typeorm";


export class AnswerRepository implements IAnswerRepository {
    constructor(
        private readonly answerRepository: Repository<Answers>
    ) { }


    async getAnswer(question_id: string): Promise<string | null> {
        const answer = await this.answerRepository.findOne(
            {
                where: {
                    question: {
                        question_id: question_id
                    }
                },
                select: { answer: true }
            })

        if (answer?.answer == undefined) return null

        return answer.answer;
    }

    async getAnswers(question_ids: string[]): Promise<string[] | null> {
        let answers: string[] | null = []

        for (const id of question_ids) {
            const answer = await this.answerRepository.findOne({
                where: {
                    question: {
                        question_id: id
                    }
                },
                select: { answer: true }
            })

            if (answer) {
                answers.push(answer.answer);
            }
        }

        if (answers.length === 0) return null

        return answers
    }
}