
export interface ResultDTO {
    winner: {
        id: string,
        username: string,
        elo: number
    },
    loser: {
        id: string,
        username: string,
        elo: number
    }
    stats: Record<string, { num_correct: number, total_time: number }>
}