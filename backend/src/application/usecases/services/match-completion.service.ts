import { World } from "src/entities/World";
import { SubmissionRegistryComponent, SubmissionComponent, MatchComponent, PlayersComponent, LifeComponent } from "src/entities/components";
import { IMatchRepository } from "src/application/interfaces/repositories/IMatchRepository";
import { MatchResultService } from "./match-result.service";
import { PlayerStatsDTO } from "src/entities/dtos/player-stats.dto";

export class MatchCompletionService {
    constructor(
        private readonly match_repo: IMatchRepository,
        private readonly match_result_service: MatchResultService,
        private readonly world: ReturnType<typeof World>
    ) { }


    async execute(ecs_match_id: number, db_match_id: string, is_ranked: boolean) {
        const { getMatchComponent } = this.world;

        const submission_registry = getMatchComponent<SubmissionRegistryComponent>(ecs_match_id, 'Submission');
        const players = getMatchComponent<PlayersComponent>(ecs_match_id, 'Players');
        const match = getMatchComponent<MatchComponent>(ecs_match_id, 'Match');

        if (!submission_registry || !players || !match) throw new Error("Missing match components");

        // reading every submission
        const submissionsByPlayer = this.getPlayerSubmissions(submission_registry);
        const placements = this.getPlaces(players, submissionsByPlayer, match.start_time);
        const playerStats = this.buildPlayerStats(submissionsByPlayer,placements);



        await this.match_repo.completeMatch(db_match_id, 'completed');

        return await this.match_result_service.finaliseMatch(
            db_match_id,
            is_ranked,
            playerStats
        );
    }

    private getPlayerSubmissions(submission_registry: SubmissionRegistryComponent) {
        const { getSubmissionComponent } = this.world;

        const submissions = new Map<string, SubmissionComponent[]>();
        for (const submission_entity of submission_registry.submissions.values()) {
            const sub = getSubmissionComponent<SubmissionComponent>(submission_entity, 'Submission');
            if (!sub) continue;

            if (!submissions.has(sub.player_id)) {
                submissions.set(sub.player_id, []);
            }
            submissions.get(sub.player_id)!.push(sub);
        }

        return submissions;
    }

    private getPlaces(players: PlayersComponent, submissions: Map<string, SubmissionComponent[]>, match_start: Date): Map<string, number> {
        const { getPlayerComponent } = this.world;

        const finalists: string[] = [];
        const eliminated: { player_id: string, eliminated_at: Date }[] = [];

        for (const [player_id, player_entity] of players.players) {
            const life = getPlayerComponent<LifeComponent>(player_entity, 'Life');

            if (life && life.current_life <= 0) {
                eliminated.push({ player_id, eliminated_at: life.eliminated_at! });
            }
            else {
                finalists.push(player_id);
            }
        }

        const rank_finalists = [...finalists].sort((a, b) => {
            const a_submission = submissions.get(a) ?? [];
            const b_submission = submissions.get(b) ?? [];

            // count correct answers 
            const a_correct = a_submission.filter(s => s.correct).length;
            const b_correct = b_submission.filter(s => s.correct).length;

            if (a_correct !== b_correct) return b_correct - a_correct;
            return this.getLastSubmissionTime(a_submission, match_start) - this.getLastSubmissionTime(b_submission, match_start);
        })

        const rank_eliminated = [...eliminated]
            .sort((a, b) => b.eliminated_at.getTime() - a.eliminated_at.getTime())
            .map(e => e.player_id);

        const placements = new Map<string, number>();
        [...rank_finalists, ...rank_eliminated].forEach((player_id, idx) => {
            placements.set(player_id, idx + 1);
        });

        return placements;
    }

    private buildPlayerStats(playerSubmissions: Map<string, SubmissionComponent[]>, placements: Map<string, number>): PlayerStatsDTO[] {
        const playerStats: PlayerStatsDTO[] = [];

        for (const [player_id, submissions] of playerSubmissions) {
            const correct = submissions.filter(s => s.correct).length;
            const speed = Number(this.formatSpeed(submissions));
            const placement = placements.get(player_id)!;

            playerStats.push({ user_id: player_id, correctness: correct, speed, placement });
        }

        return playerStats;
    }

    private getLastSubmissionTime(submissions: SubmissionComponent[], match_start: Date): number {
        if (submissions.length === 0) return Infinity;

        const last_submission = submissions.reduce((latest, s) => s.submitted_at! > latest.submitted_at! ? s : latest);

        return last_submission.submitted_at!.getTime() - match_start.getTime();
    }

    private formatSpeed(submissions: SubmissionComponent[]): string {
        if (submissions.length === 0) return '00:00';

        const first = submissions.reduce((earliest, s) => s.submitted_at! > earliest.submitted_at! ? s : earliest);

        const last = submissions.reduce((latest, s) => s.submitted_at! > latest.submitted_at! ? s : latest);

        const totalSeconds = Math.floor((last.submitted_at!.getTime() - first.submitted_at!.getTime()) / 1000);
        const mm = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const ss = String(totalSeconds % 60).padStart(2, '0');
        return `${mm}:${ss}`;
    }
}