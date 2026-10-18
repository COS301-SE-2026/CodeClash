import { MatchType } from "src/entities/dtos/matches/match.dto";

export class RewardService {
    calculateReward(
        mode: MatchType,
        position: number,
        total_players: number,
        stat: { num_correct: number; total_time:number }
    ):  number {
        const base = mode === MatchType.tournament ? 150 
        : mode === MatchType.ranked ? 150
        : 75;

        if (position === 1) {
            // winner bonus
            return base + 100; 
        }

        // Everyone else frfr
        const taper = (position - 1) * 40;
        return Math.max(40, base-taper);
    }
}