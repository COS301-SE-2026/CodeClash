import { MatchComponent, ResultComponent, SubmissionComponent, SubmissionRegistryComponent } from "src/entities/components";
import { World } from "src/entities/World"
import { MatchStore } from "../services/match/match-store.service";
import { MatchPlayer } from "src/entities/dtos/matches/match.dto";
import { QuestionResultBuilder } from "../services/skill/question-results";
import { leagueForElo } from "src/entities/league-mapping";

export class MatchCompletionSystem {
    private readonly getMatchComponent
    private readonly getSubmissionComponent
    private readonly addMatchComponent

    constructor(
        private readonly world: ReturnType<typeof World>,
        private readonly match_store: MatchStore,
        private readonly question_results: QuestionResultBuilder = new QuestionResultBuilder()
    ) {
        const { getMatchComponent, getSubmissionComponent, addMatchComponent } = this.world
        this.getMatchComponent = getMatchComponent;
        this.getSubmissionComponent = getSubmissionComponent
        this.addMatchComponent = addMatchComponent
    }


    execute(match_id: number, player_ids: string[]) {
        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');
        const match_component = this.getMatchComponent<MatchComponent>(match_id, 'Match');

        if (!submission_registry) throw new Error('Error finishing game')
        if(!match_component) throw new Error("Error completing game");

        const match = this.match_store.get(match_id);
        if (!match?.database_id) throw new Error("Match not found");

        const match_stats = this.getStats(submission_registry.submissions, player_ids,match_component.start_time);
      const match_start = this.getMatchComponent<MatchComponent>(match_id, 'Match')?.start_time ?? new Date();

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
            total_time: stat.total_time,
            league: leagueForElo(match.players.find(player => player.id === user_id)?.elo ?? 0),
            questions: this.question_results.build(match.rounds, this.playerSubmissions(submission_registry.submissions, user_id), match_start)
        }));


        const total_questions = match.rounds.reduce((sum, round) => sum + round.questions.length, 0);

        const data: ResultComponent = {
            players: players,
            stats: Object.fromEntries(match_stats)
        };
        this.addMatchComponent(match_id, 'Result', data);

        return { players, match_stats, total_questions };
    }// end execute

    getStats(submissions: Map<string, number>, player_ids: string[], match_start: Date | null) {
        const game_stats = new Map<string, { num_correct: number, total_time: number, num_answered: number }>();
        const last_time = new Map<string, Date | null>();

        for (const id of player_ids) {
            game_stats.set(id, { num_correct: 0, total_time: 0, num_answered: 0 })
            last_time.set(id, match_start);
        }

        const entires = [...submissions].map(([key, submission]) => {
            const [player] = key.split("::");
            if (!player) throw new Error("Couldn't fecth player submissions");

            const component = this.getSubmissionComponent(submission, 'Submission');
            if (!component) throw new Error("Couldn't get player submission");
            return { player, component };
        }).sort((a, b) => (a.component.submitted_at?.getTime() ?? 0) - (b.component.submitted_at?.getTime() ?? 0));



        for (const { player, component } of entires) {
            const stat = game_stats.get(player);

            if (!stat) throw new Error("Couldn't get player data");
            if (component.correct) stat.num_correct += 1;

            if (component.submitted_at) {
                const prev = last_time.get(player) ?? component.submitted_at;
                stat.total_time += component.submitted_at.getTime() - prev.getTime();
                stat.num_answered += 1;
                last_time.set(player, component.submitted_at);
            }
        }


        return game_stats

    }

  playerSubmissions(submissions: Map<string, number>, player_id: string): SubmissionComponent[] {
    const found: SubmissionComponent[] = [] // initialising empty array n finishin
    for (const [key, submission] of submissions) { // for eawch key submission pair int he submissions
      if (key.split('::')[0] !== player_id) continue; // checks to see if its the passed in player, if not continue

      const component = this.getSubmissionComponent(submission, 'Submission');
      if (component) found.push(component); // ifthe submission was found then its pushed in ( cuz players can just not answer at all )
    }
    return found;
  }
}
