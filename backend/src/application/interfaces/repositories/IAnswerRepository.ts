import { AnswerDTO } from "src/entities/dtos/match/answer.dto"


export interface IAnswerRepository {

    getAnswer(question_id: string): Promise<AnswerDTO | null>
    getAnswers(question_ids: string[]): Promise<AnswerDTO[]>
}