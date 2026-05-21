
class UserDto {
    id: number;
    elo: number;
    joined_at: number;
    // game_mode: string;
    game_mode: "math" | "programming";
    match_attempt: number = 1;


    constructor(id: number, elo: number, game_mode: "math" | "programming") {
        this.id = id
        this.elo = elo
        this.joined_at = Date.now();
        this.game_mode = game_mode;
    }
}


export default UserDto;



export interface MatchDto {
    match_id: string;
    player1_id: number;
    player2_id: number;

    game_mode: "math" | "programming";

    difficulty: "Easy" | "Medium" | "Difficult";

    time_limit: number;
}


export function resolveDifficulty(elo: number): "Easy" | "Medium" | "Difficult" {
    if (elo <= 500) {
        return "Easy"
    }
    else if (elo <= 1000) {
        return "Medium"
    }
    return "Difficult";
}


export function resolveTimeLimit(difficulty: "Easy" | "Medium" | "Difficult"): number {
    const map: Record<"Easy" | "Medium" | "Difficult", number> = {
        Easy: 5,
        Medium: 10,
        Difficult: 15,
    };
    return map[difficulty];
}

export function buildMatchDto(
    matchId: string,
    player1Id: number,
    player1Elo: number,
    player2Id: number,
    player2Elo: number,
    game_mode: "math" | "programming"
): MatchDto {
    const lowerElo = Math.min(player1Elo, player2Elo);
    const difficulty = resolveDifficulty(lowerElo);
    return {
        match_id: matchId,
        player1_id: player1Id,
        player2_id: player2Id,
        game_mode,
        difficulty,
        time_limit: resolveTimeLimit(difficulty),
    };
}


//everything below is where the logic for the communication between the websocket and frontend is

export type GameMode = "math" | "programming";
export type Difficulty = "Easy" | "Medium" | "Difficult";


export type ClientMessage =
  | { type: "JOIN";  userId: number; gameMode: GameMode }
  | { type: "LEAVE"; userId: number }
  | { type: "CLEAR_QUEUE"; userId: number; gameMode: GameMode };


export interface MatchData {
  match_id: string;
  player1_id: number;
  player2_id: number;
  game_mode: GameMode;
  difficulty: Difficulty;
  time_limit: number;
}

export type ServerMessage =
  | { type: "WAITING" }
  | { type: "MATCHED"; match: MatchData }
  | { type: "ERROR"; message: string }
  | { type: "QUEUE_CLEARED" }
  | { type: "NO_PLAYERS" };









