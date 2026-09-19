export interface LeagueDTO {
    name: string,
    difficulty: number[],       // [easy,medium,hard]
    elo: number[],  //[lower_bound, upper_bound]
    question_number: number
}