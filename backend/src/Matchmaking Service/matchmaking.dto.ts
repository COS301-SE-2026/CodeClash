
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


export interface GameCategory {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: 5 | 10 | 15;    //i lowk forgot the time options, this may need to be changed
}

export interface MatchRequestDto {
  userId: string;
  categories: GameCategory;
  ranked: MatchRanked;
}

export enum MatchStatus {
  SEARCHING = 'SEARCHING',
  FOUND = 'FOUND',
  NOT_FOUND = 'NOT_FOUND'
}

export enum MatchRanked{
  RANKED = 'RANKED',
  UNRANKED = 'UNRANKED',
}

export interface QueueTicket {
  ticketId: string;
  request: MatchRequestDto;
  status: MatchStatus;
  opponentId?: string;
  matchId?: string;
}

