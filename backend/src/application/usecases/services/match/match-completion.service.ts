import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { MatchCompletionSystem } from "../../systems/match-completion.system";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { AchievementService } from "../achievement.service";
import { MatchType, MatchStatus } from "src/entities/dtos/matches/match.dto";

const SKILL_PROGRESS_DAYS = 30;
const SKILL_PROGRESS_WINDOW = 20;




export class MatchCompletionService {
    constructor(
        private readonly match_repo: IMatchRepository,
        private readonly completion_system: MatchCompletionSystem,
        private readonly user_repo: IUserRepository,
        private readonly achievement_service: AchievementService
    ) { }


    async execute(ecs_match_id: number, db_match_id: string, player_ids: string[], match_type: MatchType) {
        const { players, match_stats, total_questions } = await this.completion_system.execute(ecs_match_id, player_ids);

        switch (match_type) {
            case MatchType.ranked: {
                const first = players[0]!.id;
                const second = players[1]!.id;

                const { winner, loser } = await this.user_repo.updateEloAfterMatch(first, second);

                players[0]!.elo_change = winner.elo_gained;
                players[1]!.elo_change = loser.elo_gained;
                break;
            }
            case MatchType.tournament: {
                const results = players.map(p => ({ user_id: p.id, placement: p.position }));
                const updates = await this.user_repo.updateEloAfterTournament(results);

                for (const update of updates) {
                    const player = players.find(p => p.id === update.user_id);
                    if (player) player.elo_change = update.elo_gained;
                }
                break;
            }
        }

        this.achievement_service.evaluateForMatch(match_stats, players, match_type, total_questions);

        await this.match_repo.updatePlayers(db_match_id, players);
        await this.match_repo.completeMatch(db_match_id, MatchStatus.Completed);

        return this.match_repo.buildMatchResult(db_match_id);
    }


    async getMatchResults(match_id: string) {
        return this.match_repo.buildMatchResult(match_id);
    }

    async getMatchHistory(user_id: string){
        return this.match_repo.getMatchHistory(user_id);
    }

    async getSkillProgress(user_id: string) {
        const since = new Date(Date.now() - SKILL_PROGRESS_DAYS * 24 * 60 * 60 * 1000);
        return this.match_repo.getSkillProgress(user_id); // will get back to this
    }
}


