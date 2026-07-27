export interface PlayerResultDTO {
    user_id: string;
    username: string;
    avatar: string;
    correctness: number;
    speed: string; // percentage 0-100
    eloEffect: number; // mm:ss
    position: 1 | 2; //signed 
}

export interface MatchResultDTO {
    match_id: string;
    players: PlayerResultDTO[];
}