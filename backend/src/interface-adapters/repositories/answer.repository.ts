import { IAnswerRepository } from "src/application/interfaces/repositories/IAnswerRepository";
import { Answers } from "src/entities/db-entities/answers.entities";
import { Repository } from "typeorm";
import { AnswerDTO } from "src/entities/dtos/answer.dto";

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
                    question:{
                        question_id: true
                    }
                },
                relations:{
                    question: true
                }
            })

        if (answer?.answer == undefined) return null

        return { answer: answer.answer, question_id: answer.question.question_id };
    }

    async getAnswers(question_ids: string[]): Promise<AnswerDTO[]> {
        let answers: AnswerDTO[] | null = []

        for (const id of question_ids) {
            const answer = await this.answerRepository.findOne({
                where: {
                    question: {
                        question_id: id
                    }
                },
                select: { 
                    answer: true, 
                    answer_id: true,
                    question:{
                        question_id: true
                    }
                },
                relations:{
                    question: true
                }
            })

            if (answer) {
                answers.push({ answer: answer.answer, question_id: answer.question.question_id });
            }
        }

        return answers
    }
}