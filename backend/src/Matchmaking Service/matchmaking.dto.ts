
class UserDto{
    id: number;
    elo: number;
    joined_at: number;
    game_mode: string;
    match_attempt: number = 1;


    constructor(id: number, elo: number,game_mode: string) {
    this.id = id
    this.elo = elo
    this.joined_at = Date.now();
    this.game_mode = game_mode;
}
}


export default UserDto;


export interface MatchStatusEvent {
  status: 'searching' | 'found' | 'notFound';
  match_id?: string;
  player1_id?: string;
  player2_id?: string;
}

