import { MatchType } from "src/entities/dtos/matches/match.dto";

export class RewardService {
    calculateReward(
        mode: MatchType,
        position: number,
        total_players: number,
        stat: { num_correct: number; total_time:number }
    ):  number {
        const base = mode === 'ranked' ? 60 : 25;

        if (position === 1) {
            // winner bonus
            return base + 40; 
        }

        // Everyone else frfr
        const taper = (position - 1) * 15;
        return Math.max(15, base-taper);
    }
}