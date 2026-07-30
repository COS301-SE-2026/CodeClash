import { PlayerDTO } from "src/entities/dtos/components.dto";
import { GameQuestionsDTO } from "src/entities/dtos/match-data.dto";


export class GameStore {
    private GAME = new Map<number, { players: PlayerDTO[], questions: GameQuestionsDTO }>();
    constructor() { }


    create(match_id: number, players: PlayerDTO[], questions: GameQuestionsDTO) {
        this.GAME.set(match_id, {players: players, questions: questions});
    }
}