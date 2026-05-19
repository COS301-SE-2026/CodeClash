
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



export interface MatchDto {
  match_id: string;
 
  player1_id: number;
  player2_id: number;
 
  game_mode: "math" | "prog";
 
  difficulty: "Easy" | "Medium" | "Difficult";
 
  time_limit: number;
}
 

export function resolveDifficulty(elo: number): "Easy" | "Medium" | "Difficult"{
  if (elo <= 500){ 
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
    Difficult: 50,
  };
  return map[difficulty];
}
 

 


 



