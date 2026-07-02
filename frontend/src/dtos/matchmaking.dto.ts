
class MatchmakingUserDTO{
    elo: number;
    game_mode: string;


    constructor(elo: number,game_mode: string) {
    this.elo = elo
    this.game_mode = game_mode;
}
}


export default MatchmakingUserDTO;