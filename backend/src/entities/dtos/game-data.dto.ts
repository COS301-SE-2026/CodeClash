export interface GameDataDTO{
    pair_id:string,
    player_ids: string[],
    league: string,
    game_mode: "Maths" | "Prog",
    question_number: number
}