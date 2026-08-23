import { IAchievementRepository } from "src/application/interfaces/repositories/IAchievementRepository";
import { AchievementDTO } from "src/interface-adapters/dtos/achievement.dto";

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
    { name: 'First Blood',      check: s => s.total_wins >=1 },
    { name: 'On a Roll',        check: s => s.win_streak >=3 },
    { name: 'Unstoppable',      check: s => s.win_streak >=10 },
    { name: 'Math Wizard',      check: s => s.perfect_math },
    { name: 'Code Breaker',     check: s => s.perfect_code },
    { name: 'Speed Demon',      check: s => s.match_duration_ms < 2 * 60 * 1000 },
    { name: 'Veteran',          check: s => s.total_matches >= 50 },
    { name: 'Century',          check: s => s.total_matches >=100 },
    { name: 'Sharp Shooter',    check: s => s.correct_in_match >=5 },
    { name: 'Social Butterfly', check: s => s.friend_count >=5 },
    { name: 'Challenger',       check: s => s.league === 'Venus'},
    { name: 'Elite',            check: s => s.league === 'Mars' },
    { name: 'Champion',         check: s => s.league === 'Saturn'},
    { name: 'Legend',           check: s => s.league === 'Neptune' }
    //{ name: 'Comeback Kid',   check: s => s.life_lost_before_win >= 60 },
]