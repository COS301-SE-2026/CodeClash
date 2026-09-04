import { AnswerDTO } from "../../../entities/dtos/answer.dto";


export interface IGameCache{
    saveGame(game_id: number, player_ids: string[], question_ids: string[]): Promise<void>;
    saveAnswer(answer: AnswerDTO): Promise<void>;
    getAnswer(question_id:string): Promise<AnswerDTO | null>;
}