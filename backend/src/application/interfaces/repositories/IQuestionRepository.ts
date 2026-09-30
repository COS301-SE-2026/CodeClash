import { ProgrammingTemplates, TestCases } from "src/entities/database/questions.entities";
import { MatchMode } from "src/entities/dtos/matches/match.dto";
import { QuestionDTO } from "src/entities/dtos/questions/question.dto";


export interface IQuestionRepository{
    
    getRandQuestions(count: number, difficulty: number, game_mode: MatchMode): Promise<QuestionDTO[]>,
    getTestCases(question_id: string): Promise<TestCases[]>,
    getTemplates(question_id: string): Promise<ProgrammingTemplates[]>
}