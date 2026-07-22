import { QuestionDTO } from "src/entities/dtos/question.dto";


export interface IQuestionRepository{
    
    getRandQuestions(count: number, difficulty: number, game_mode: 'Maths'|'Prog'): Promise<QuestionDTO[]|null>
}