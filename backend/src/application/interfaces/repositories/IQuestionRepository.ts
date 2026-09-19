import { MatchMode } from "src/entities/dtos/match/match.dto";
import { QuestionDTO } from "src/entities/dtos/match/question.dto";


export interface IQuestionRepository{
    
    getRandQuestions(count: number, difficulty: number, game_mode: MatchMode): Promise<QuestionDTO[]>
}