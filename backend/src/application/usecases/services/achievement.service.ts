import { IAchievementRepository } from "src/application/interfaces/repositories/IAchievementRepository";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { AchievementDTO } from "src/entities/dtos/achievements/achievement.dto";
import { MatchPlayer, MatchType } from "src/entities/dtos/match/match.dto";

// Achievement conditions -- will be extended as needed
// N.B I haven't implemented "Comeback Kid" because of how life is calculated at the moment, it's too match dependent
export type AchievementCondition = {
    name: string;
    check: (stats: AchievementStats) => boolean;
}

export interface AchievementStats {
    total_wins: number;
    win_streak: number;
    total_matches: number;
    perfect_math: boolean;
    perfect_code: boolean;
    match_duration_ms: number;
    correct_in_match: number;
    friend_count: number;
    life_lost_before_win: number;
    league: string;
}

const CONDITIONS: AchievementCondition[] = [
    { name: 'First Blood', check: s => s.total_wins >= 1 },
    { name: 'On a Roll', check: s => s.win_streak >= 3 },
    { name: 'Unstoppable', check: s => s.win_streak >= 10 },
    { name: 'Math Wizard', check: s => s.perfect_math },
    { name: 'Code Breaker', check: s => s.perfect_code },
    { name: 'Speed Demon', check: s => s.match_duration_ms < 2 * 60 * 1000 },
    { name: 'Veteran', check: s => s.total_matches >= 50 },
    { name: 'Century', check: s => s.total_matches >= 100 },
    { name: 'Sharp Shooter', check: s => s.correct_in_match >= 5 },
    { name: 'Social Butterfly', check: s => s.friend_count >= 5 },
    { name: 'Challenger', check: s => s.league === 'Venus' },
    { name: 'Elite', check: s => s.league === 'Mars' },
    { name: 'Champion', check: s => s.league === 'Saturn' },
    { name: 'Legend', check: s => s.league === 'Neptune' }
    //{ name: 'Comeback Kid',   check: s => s.life_lost_before_win >= 60 },
]

export class AchievementService {
    constructor(
        private readonly achievement_repo: IAchievementRepository,
        private readonly user_repo: IUserRepository
    ) { }

    async getAllAchievements(): Promise<AchievementDTO[]> {
        return this.achievement_repo.getAllAchievements();
    }

    async getUserAchievements(user_id: string): Promise<AchievementDTO[]> {
        return this.achievement_repo.getUserAchievements(user_id);
    }

    // TODO Called after a match, passing user's current status
    async evaluateAndAward(user_id: string, stats: AchievementStats): Promise<AchievementDTO[]> {
        const awarded: AchievementDTO[] = [];

        for (const condition of CONDITIONS) {
            if (!condition.check(stats)) continue

            const achievement = await this.achievement_repo.getAchievementByName(condition.name);

            if (!achievement) continue;

            const already = await this.achievement_repo.hasAchievement(user_id, achievement.achievement_id);
            if (already) continue;

            await this.achievement_repo.awardAchievement(user_id, achievement.achievement_id);
            awarded.push(achievement);
        }

        return awarded;
    }

    async evaluateForMatch(match_stats: Map<string, { num_correct: number, total_time: number }>, players: MatchPlayer[], match_type: MatchType, total_questions: number) {
        for (const [user_id, stat] of match_stats) {
            const player = players.find(p => p.id === user_id);
            const is_winner = player?.position === 1;
            const is_ranked = match_type === MatchType.ranked;

            // update streaks
            if (is_ranked) {
                await this.user_repo.updateStreaks(user_id, is_winner);
            }

            const userStats = await this.user_repo.getTotalStats(user_id);

            const achievementStats: AchievementStats = {
                total_wins: is_winner ? userStats.total_wins + 1 : userStats.total_wins,
                win_streak: is_winner ? userStats.winning_streak + 1 : 0,
                total_matches: userStats.total_matches + 1,
                perfect_math: stat.num_correct === total_questions && match_type !== MatchType.ranked,
                perfect_code: false,
                match_duration_ms: 0,
                correct_in_match: stat.num_correct,
                friend_count: 0,
                life_lost_before_win: 0,
                league: userStats.league
            };
            await this.evaluateAndAward(user_id, achievementStats);
        }
    }
}