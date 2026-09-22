import { ResultComponent, SubmissionRegistryComponent } from "src/entities/components";
import { World } from "src/entities/World"
import { MatchStore } from "../services/match/match-store.service";
import { MatchPlayer, MatchType } from "src/entities/dtos/match/match.dto";
import { AchievementService, AchievementStats } from "../services/achievement.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";

export class MatchCompletionSystem {
    private readonly getMatchComponent
    private readonly getSubmissionComponent
    private readonly addMatchComponent

    constructor(
        private readonly world: ReturnType<typeof World>,
        private readonly game_store: MatchStore,
        private readonly achievement_service: AchievementService,
        private readonly user_repo: IUserRepository,
        private readonly match_repo: IMatchRepository
    ) {
        const { getMatchComponent, getSubmissionComponent, addMatchComponent } = this.world
        this.getMatchComponent = getMatchComponent;
        this.getSubmissionComponent = getSubmissionComponent
        this.addMatchComponent = addMatchComponent
    }


    async execute(match_id: number, player_ids: string[], match_type: MatchType) {

        // 1. get submission entities for players
        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');

        if (!submission_registry) throw new Error('Error finishing game')

        const db_match_id = this.game_store.get(match_id);
        if (!db_match_id?.database_id) throw new Error("Match not found");

        const game_stats = this.getStats(submission_registry.submissions, player_ids);

        const ranked_players = [...game_stats.entries()]
            .sort(([, a], [, b]) => {
                if (a.num_correct !== b.num_correct) {
                    return b.num_correct - a.num_correct;
                }
                return a.total_time - b.total_time;
            });

        if (ranked_players.length < 2) throw new Error("Not enough players");

        const players: MatchPlayer[] = ranked_players.map(([user_id, stat], index) => ({
            id: user_id,
            position: index + 1,
            elimination_round: null,
            elo_change: 0,
            num_correct: stat.num_correct,
            total_time: stat.total_time
        }));

        if(match_type === MatchType.ranked){
            const first = players[0]!.id;
            const second = players[1]!.id;

            const {winner, loser} = await this.user_repo.updateRatingsAfterMatch(first, second);
            
        }

        // evaluate achivements for both players
        const match_duration_ms = 0; //Date.now() - (result!.start_time?.getTime?.() ?? 0);
        for (const [user_id, stat] of game_stats) {
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
                perfect_math: stat.num_correct === submission_registry.submissions.size / 2 && game_type !== MatchType.ranked,
                perfect_code: false,
                match_duration_ms,
                correct_in_match: stat.num_correct,
                friend_count: 0,
                life_lost_before_win: 0,
                league: userStats.league
            };
            await this.achievement_service.evaluateAndAward(user_id, achievementStats);
        }
        const data: ResultComponent = {
            players: players,
            stats: Object.fromEntries(game_stats)
        }

        this.addMatchComponent(match_id, 'Result', data);



        return data;
    }// end execute

    getStats(submissions: Map<string, number>, player_ids: string[]) {
        const game_stats = new Map<string, { num_correct: number, total_time: number }>();
        for (const id of player_ids) {
            game_stats.set(id, { num_correct: 0, total_time: 0 })
        }

        for (const [key, submission] of submissions) {
            const [player] = key.split('::')

            if (!player) throw new Error("Couldn't fetch player submissions");
            const stat = game_stats.get(player);

            if (!stat) throw new Error("Couldn't get player data");

            // get submission component 
            const component = this.getSubmissionComponent(submission, 'Submission');

            if (!component) throw new Error("Couldn't get player submissions")

            const correct = component.correct ?? false; // null -> false
            if (correct) stat.num_correct += 1;

            const time = component.submitted_at && component.started_at
                ? component.submitted_at!.getTime() - component.started_at!.getTime()
                : 0; // unanswered questions are treated as 0 time
            stat.total_time += time
        }

        return game_stats

    }
}
