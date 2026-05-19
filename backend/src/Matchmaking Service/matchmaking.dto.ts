
class UserDto{
    id: number;
    elo: number;
    joined_at: number;
    // game_mode: string;
    game_mode: "math" | "prog";
    match_attempt: number = 1;


    constructor(id: number, elo: number,game_mode: "math" | "prog") {
    this.id = id
    this.elo = elo
    this.joined_at = Date.now();
    this.game_mode = game_mode;
}
}


export default UserDto;


 



