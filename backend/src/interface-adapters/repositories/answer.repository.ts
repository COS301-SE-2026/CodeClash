import { IAnswerRepository } from "src/application/interfaces/repositories/IAnswerRepository";
import { Answers } from "src/entities/db-entities/answers.entities";
import { AnswerDTO } from "src/interface-adapters/dtos/answer.dto";
import { Repository, In } from "typeorm";

export class AnswerRepository implements IAnswerRepository {
    constructor(
        private readonly answerRepository: Repository<Answers>
    ) { }


    async getAnswer(question_id: string): Promise<AnswerDTO | null> {
        const answer = await this.answerRepository.findOne(
            {
                where: {
                    question: {
                        question_id: question_id
                    }
                },
                select: {
                    answer: true,
                    answer_id: true,
                    question: {
                        question_id: true
                    }
                },
                relations: {
                    question: true
                }
            })

        if (answer?.answer == undefined) return null

        return { answer: answer.answer, question_id: answer.question.question_id };
    }

    async getAnswers(question_ids: string[]): Promise<AnswerDTO[]> {
        const answers = await this.answerRepository.find({
            where: {
                question: {
                    question_id: In(question_ids)
                }
            },
            select: {
                answer: true,
                answer_id: true,
                question: {
                    question_id: true
                }
            },
            relations: {
                question: true
            }
        })

        return answers.map(a => ({
            answer: a.answer,
            question_id: a.question.question_id
        }))

    }
}