import { IAnswerRepository } from "src/application/interfaces/repositories/IAnswerRepository";
import { Answers } from "src/entities/db-entities/answers.entities";
import { AnswerDTO } from "src/entities/dtos/answer.dto";
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
                      question_id: true,
                      answer_format: true,
                      answer_precision:  true
                    }
                },
                relations: {
                    question: true
                }
            })

        if (answer?.answer === undefined) return null

        return { answer: answer.answer, question_id: answer.question.question_id, format: answer.question.answer_format, precision: answer.question.answer_precision};
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
                    question_id: true,
                    answer_format: true,
                    answer_precision: true
                }
            },
            relations: {
                question: true
            }
        })

        return answers.map(a => ({
            answer: a.answer,
            question_id: a.question.question_id,
            format: a.question.answer_format,
            precision: a.question.answer_precision
        }))

    }
}