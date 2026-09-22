<<<<<<<< HEAD:backend/src/entities/dtos/questions/answer.dto.ts
import { AnswerFormat } from "../../db-entities/questions.entities";
========
import { AnswerFormat } from "../../database/questions.entities";
>>>>>>>> 4d369e3dc525c5605cd6bb46c8ddffb759e092e2:backend/src/entities/dtos/match/answer.dto.ts

export interface AnswerDTO{
    answer: string,
    question_id: string
  format: AnswerFormat | null // for prog matches 
  precision: number | null
}