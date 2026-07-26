import { GameMode } from "../db-entities/questions.entities";

class MatchmakingUserDTO{
    id: string;
    elo: number;
    joined_at: number;
    game_mode: GameMode;
    match_attempt: number = 1;


    constructor(id: string, elo: number,game_mode: GameMode) {
    this.id = id
    this.elo = elo
    this.joined_at = Date.now();
    this.game_mode = game_mode;
}
}


export default MatchmakingUserDTO;