import { IEloRepository } from "src/application/interfaces/repositories/IEloRepository";
// import { IMatchResultRepository } from "src/application/interfaces/repositories/IMatchResultRepository";
import { IMatchResultRepository } from "../../interfaces/repositories/IMatchResultRepository";
import { MatchResultDTO, PlayerResultDTO } from "src/entities/dtos/match-result.dto";
import { PlayerStatsDTO } from "src/entities/dtos/player-stats.dto";

export class MatchResultService{
    constructor(
        private readonly elo_repo: IEloRepository,
        private readonly match_result_repo: IMatchResultRepository
    ) {}

    async finaliseMatch(
        match_id: string,
        winner_id: string,
        loser_id: string,
        is_ranked: boolean,
        playerStats: PlayerStatsDTO[]
    ): Promise<MatchResultDTO>{
        let eloEffects = new Map<string, number>();

        if(is_ranked) {
            const { winner, loser } = await this.elo_repo.updateRatingsAfterMatch(match_id, winner_id, loser_id);
            await this.match_result_repo.saveMatchLog(match_id, winner_id, loser_id, winner.elo_gained, -loser.elo_gained);
            eloEffects.set(winner_id,0);
            eloEffects.set(loser_id, 0);
        }else{
            await this.match_result_repo.saveMatchLog(match_id, winner_id, loser_id, null, null);
            eloEffects.set(winner_id,0);
            eloEffects.set(loser_id, 0);
        }

        const players: PlayerResultDTO[] = [];

        for (const stat of playerStats) {
            const user_details = await this.match_result_repo.getUserDetails(stat.user_id);

            players.push({
                user_id: stat.user_id,
                username: user_details.username,
                avatar: user_details.avatar,
                correctness: stat.correctness,
                speed: stat.speed,
                eloEffect: eloEffects.get(stat.user_id) ?? 0,
                position: stat.user_id === winner_id ? 1 : 2
            });
        }

        players.sort((a, b) => a.position - b.position);

        return { match_id, players };
    }
}