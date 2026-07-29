export interface PlayerResultDTO {
    user_id: string;
    username: string;
    avatar: string;
    correctness: number;// percentage 0-100
    speed: string; // mm:ss
    eloEffect: number; //signed 
    position: 1 | 2; 
}

export interface MatchResultDTO {
    match_id: string;
    players: PlayerResultDTO[];
}