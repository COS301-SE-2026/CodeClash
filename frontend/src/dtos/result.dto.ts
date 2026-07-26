
export interface ResultDTO {
    winner: string,
    loser: string,
    winner_elo: number,
    loser_elo: number,
    stats: Map<string, { num_correct: number, total_time: number }>
}