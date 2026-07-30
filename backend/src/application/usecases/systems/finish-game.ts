import { PlayerInfoComponent, PlayersComponent, ResultComponent, SubmissionRegistryComponent } from "src/entities/components";
import { World } from "src/entities/World"


export class FinishGame {
    private readonly getMatchComponent
    private readonly getSubmissionComponent
    private readonly getPlayerComponent
    private readonly addMatchComponent

    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { getMatchComponent, getSubmissionComponent, getPlayerComponent, addMatchComponent } = this.world
        this.getMatchComponent = getMatchComponent;
        this.getSubmissionComponent = getSubmissionComponent
        this.getPlayerComponent = getPlayerComponent
        this.addMatchComponent = addMatchComponent
    }


    execute(match_id: number, player_ids: string[]) {
        // 1. get submission entities for players

        const submission_registry = this.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');

        if (!submission_registry) throw new Error('Error finishing game')

        const game_stats = new Map<string, { num_correct: number, total_time: number }>();

        for (const id of player_ids) {
            game_stats.set(id, { num_correct: 0, total_time: 0 })
        }

        // 2 get stats
        for (const [key, submission] of submission_registry.submissions) {
            const [player] = key.split('::')

            if (!player) throw new Error("Couldn't fetch player submissions");
            const stat = game_stats.get(player);

            if (!stat) throw new Error("Couldn't get player data");

            // get submission component 
            const component = this.getSubmissionComponent(submission, 'Submission');

            if (!component) throw new Error("couldnt get player submissions")

            if (component.correct) stat.num_correct += 1;
            const time = component.submitted_at!.getTime() - component.started_at!.getTime();
            stat.total_time += time
        }

        // calculate winner 
        let winner: string | null = null;
        let winner_stats: { num_correct: number, total_time: number } | null = null

        for (const [id, stat] of game_stats) {
            if (winner == null ||
                winner_stats!.num_correct < stat.num_correct ||
                winner_stats!.num_correct === stat.num_correct && winner_stats!.total_time > stat.total_time
            ) {
                winner = id;
                winner_stats = stat
            }
        }

        // elo updates 

        const players_component = this.getMatchComponent<PlayersComponent>(match_id, 'Players');
        if (!players_component) throw new Error("Error updating elo ")

        const winner_entity = players_component.players.get(winner!)
        const loser = [...players_component.players.keys()].find(id => id != winner)    // get the other player

        if (!loser) throw new Error("Error getting player info")


        const loser_enitity = players_component.players.get(loser)


        const winner_info = this.getPlayerComponent<PlayerInfoComponent>(winner_entity!, 'Info');
        const loser_info = this.getPlayerComponent<PlayerInfoComponent>(loser_enitity!, 'Info');

        const elo_updates = this.eloUpdate(winner_info!.elo, loser_info!.elo)

        const data: ResultComponent = {
            winner: {
                id: winner!,
                elo: elo_updates.win
            },
            loser: {
                id: loser,
                elo: elo_updates.lose
            },
            stats: Object.fromEntries(game_stats)
        }

        this.addMatchComponent(match_id, 'Result', data);

        return data
    }

    eloUpdate(winner_elo: number, loser_elo: number) {
        const K = 32;
        const expected_winner = 1 / (1 + Math.pow(10, (loser_elo - winner_elo) / 400));
        const expected_loser = 1 / (1 + Math.pow(10, (winner_elo - loser_elo) / 400));

        const new_win = Math.round(winner_elo + K * (1 - expected_winner));
        const new_lose = Math.round(loser_elo + K * (0 - expected_loser));

        return {
            win: new_win,
            lose: new_lose
        }
    }
}