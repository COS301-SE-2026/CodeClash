import { ResultComponent, SubmissionRegistryComponent } from "src/entities/components";
import { World } from "src/entities/World"
import { MatchStore } from "../services/match/match-store.service";
import { MatchPlayer } from "src/entities/dtos/matches/match.dto";

export class MatchCompletionSystem {
    private readonly getMatchComponent
    private readonly getSubmissionComponent
    private readonly addMatchComponent

    constructor(
        private readonly world: ReturnType<typeof World>,
        private readonly match_store: MatchStore,
    ) {
        const { getMatchComponent, getSubmissionComponent, addMatchComponent } = this.world
        this.getMatchComponent = getMatchComponent;
        this.getSubmissionComponent = getSubmissionComponent
        this.addMatchComponent = addMatchComponent
    }


    async execute(match_id: number, player_ids: string[]) {
        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');
        if (!submission_registry) throw new Error('Error finishing game')

        const match = this.match_store.get(match_id);
        if (!match?.database_id) throw new Error("Match not found");

        const match_stats = this.getStats(submission_registry.submissions, player_ids);

        const ranked_players = [...match_stats.entries()]
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


        const total_questions = match.rounds.reduce((sum, round) => sum + round.questions.length, 0);

        const data: ResultComponent = {
            players: players,
            stats: Object.fromEntries(match_stats)
        };
        this.addMatchComponent(match_id, 'Result', data);

        return { players, match_stats, total_questions };
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
