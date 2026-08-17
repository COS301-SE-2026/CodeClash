import { MatchComponent, PlayersComponent, SubmissionRegistryComponent } from "src/entities/components";
import { World } from "src/entities/World";
import { GameStore } from "../services/game-store.service";
import { MatchedUsersService } from "../services/matched-users.service";

export class DeleteGame {
    private readonly getMatchComponent
    private readonly removePlayerEntity
    private readonly removeSubmissionEntity
    private readonly removeMatchEntity
    private readonly removeRoundEntity
    constructor(
        private readonly world: ReturnType<typeof World>,
        private readonly game_store: GameStore,
        private readonly matched_users: MatchedUsersService

    ) {
        const { getMatchComponent, removePlayerEntity, removeMatchEntity, removeSubmissionEntity, removeRoundEntity } = this.world
        this.getMatchComponent = getMatchComponent
        this.removePlayerEntity = removePlayerEntity
        this.removeMatchEntity = removeMatchEntity
        this.removeSubmissionEntity = removeSubmissionEntity
        this.removeRoundEntity = removeRoundEntity
    }


    execute(match_id: number, pair_id: string) {

        const players = this.getMatchComponent<PlayersComponent>(match_id, 'Players');
        const submission = this.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');
        const match = this.getMatchComponent<MatchComponent>(match_id, 'Match');

        // Get and delete player entities

        if (players) {
            for (const entity of players.players.values()) {
                this.removePlayerEntity(entity);
            }
        }

        // Get and Delete round entites
        if (match) {
            for (const entity of match.rounds) {
                this.removeRoundEntity(entity)
            }
        }
        // Get and Delete submission entities
        if (submission) {
            for (const entity of submission.submissions.values()) {
                this.removeSubmissionEntity(entity);
            }
        }

        // Delete match
        this.removeMatchEntity(match_id);
        // remove from game store

        const stored = this.game_store.get(match_id);

        if (stored) {
            this.game_store.deleteGame(match_id);
        }
        // remove from matched_users
        this.matched_users.deletePair(pair_id)


    }


}