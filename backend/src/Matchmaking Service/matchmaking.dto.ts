
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


export interface GameSelectionDto {
  userId: number;
  elo: number;
  type: 'math' | 'programming';
  game_mode: 'ranked' | 'casual';
  difficulty: 'Easy' | 'Medium' | 'Difficult';
  time_limit: 30 | 60 | 120; 

  //below is not necessary for now but i will leave it here as a reminder for it to be involved in future
//   match_attempt: number; // for ELO range expansion
//   joined_at: number; // timestamp
}


export interface MatchResultDto {
  success: boolean;
  match_id?: string;
  opponent_id?: number;
  message: 'match_found' | 'no_match' | 'still_searching';
}


export interface QueueStatusDto {
  status: 'searching' | 'found' | 'noFound';
  match_id?: string;
  opponent_id?: number;
  queue_position?: number;
}

