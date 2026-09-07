import { ResultComponent, SubmissionRegistryComponent } from "src/entities/components";
import { PlayerStatsDTO } from "src/entities/dtos/player-stats.dto";
import { World } from "src/entities/World"
import { MatchResultService } from "../services/match-result.service";
import { GameStore } from "../services/game-store.service";
import { GameType } from "src/entities/db-entities/questions.entities";
import { DeleteGame } from "./delete-game";
import { IMatchStatsRepository } from "src/application/interfaces/repositories/IMatchStatsRepository";
import { AchievementService, AchievementStats } from "../services/achievement.service";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";

export class FinishGame {
    private readonly getMatchComponent
    private readonly getSubmissionComponent
    private readonly addMatchComponent

    constructor(
        private readonly world: ReturnType<typeof World>,
        private readonly match_result_service: MatchResultService,
        private readonly game_store: GameStore,
        private readonly delete_game: DeleteGame,
        private readonly match_stats_repo: IMatchStatsRepository,
        private readonly achievement_service: AchievementService,
        private readonly user_repo: IUserRepository
    ) {
        const { getMatchComponent, getSubmissionComponent, addMatchComponent } = this.world
        this.getMatchComponent = getMatchComponent;
        this.getSubmissionComponent = getSubmissionComponent
        this.addMatchComponent = addMatchComponent
    }


    async execute(match_id: number, player_ids: string[], game_type: GameType, pair_id:string) {

        // 1. get submission entities for players
        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');

        if (!submission_registry) throw new Error('Error finishing game')

        const game_stats = this.getStats(submission_registry.submissions, player_ids);
        const db_match_id = this.game_store.get(match_id);

        //persist match stats
        for(const [user_id, stat] of game_stats){
            await this.match_stats_repo.saveStats(db_match_id!.database_id, user_id, stat.num_correct, stat.total_time);
        }

        // calculate winner 
        let winner: string | null = null;
        let winner_stats: PlayerStatsDTO | null = null

        let loser: string | null = null;
        let loser_stat: PlayerStatsDTO | null = null;

        for (const [id, stat] of game_stats) {
            if (winner == null ||
                winner_stats!.correctness < stat.num_correct ||
                winner_stats!.correctness === stat.num_correct && winner_stats!.speed > stat.total_time
            ) {

                loser = winner;
                loser_stat = winner_stats


                winner = id;
                winner_stats = {
                    user_id: id,
                    correctness: stat.num_correct,
                    speed: stat.total_time
                }
            }else{
                loser = id;
                loser_stat = {
                    user_id: id,
                    correctness: stat.num_correct,
                    speed: stat.total_time
                }
            }
        }

        // elo updates 

        if (!winner || !loser) throw new Error("Error getting user stats")

        const result = await this.match_result_service.finaliseMatch(db_match_id!.database_id, winner, loser, game_type === GameType.ranked, [winner_stats!, loser_stat!])

        // evaluate achivements for both players
        const match_duration_ms = 0; //Date.now() - (result!.start_time?.getTime?.() ?? 0);
        for(const [user_id, stat] of game_stats) {
            const is_winner = user_id === winner;
            const is_ranked = game_type === GameType.ranked;

            // update streaks
            if(is_ranked){
                await this.user_repo.updateStreaks(user_id, is_winner);
            }

            const userStats = await this.user_repo.getTotalStats(user_id);

            const achievementStats: AchievementStats = {
                total_wins: is_winner ? userStats.total_wins + 1 : userStats.total_wins,
                win_streak: is_winner ? userStats.winning_streak + 1 : 0,
                total_matches: userStats.total_matches + 1,
                perfect_math: stat.num_correct === submission_registry.submissions.size / 2 && game_type !== GameType.ranked,
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
            winner: {
                id: winner,
                elo: result.players[0]!.eloEffect!
            },
            loser: {
                id: loser,
                elo: result.players[1]!.eloEffect!
            },
            stats: Object.fromEntries(game_stats)
        }

        this.addMatchComponent(match_id, 'Result', data);



        return result
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
