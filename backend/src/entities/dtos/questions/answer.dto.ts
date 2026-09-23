import { AnswerFormat } from "../../database/questions.entities";

export interface AnswerDTO{
    answer: string,
    question_id: string
  format: AnswerFormat | null // for prog matches 
  precision: number | null
}