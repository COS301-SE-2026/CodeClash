
class UserDto{
    id: number;
    elo: number;
    joined_at: number;
    game_mode: string;


    constructor(id: number, elo: number,game_mode: string) {
    this.id = id
    this.elo = elo
    this.joined_at = Date.now();
    this.game_mode = game_mode;
}
}


export default UserDto;