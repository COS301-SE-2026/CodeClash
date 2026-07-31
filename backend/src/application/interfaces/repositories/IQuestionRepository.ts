import { GameMode } from "src/entities/db-entities/questions.entities";
import { QuestionDTO } from "src/interface-adapters/dtos/question.dto";


export interface IQuestionRepository{
    
    getRandQuestions(count: number, difficulty: number, game_mode: GameMode): Promise<QuestionDTO[]>
}