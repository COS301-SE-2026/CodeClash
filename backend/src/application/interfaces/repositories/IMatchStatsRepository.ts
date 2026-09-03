
export interface IMatchStatsRepository {
    saveStats(
        db_match_id: string,
        user_id: string,
        num_correct: number,
        total_time: number
    ): Promise<void>;

    getStatsByMatch(match_id: string): Promise<{ user_id: string; num_correct: number, total_time: number }[]>;

    getStatsByMatchAndUser(match_id: string, user_id: string): Promise< {num_correct: number, total_time: number } | null>;
}