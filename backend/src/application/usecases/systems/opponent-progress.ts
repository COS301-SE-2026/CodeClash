import { World } from "src/entities/World";
import { PlayersComponent, LifeComponent } from "src/entities/components";
import { SubmissionDTO } from "src/interface-adapters/dtos/components.dto";


export class OpponentProgress {

    private readonly getMatchComponent;
    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { getMatchComponent} = this.world

        this.getMatchComponent = getMatchComponent;

    }

    execute(data: SubmissionDTO, player_id: string) {
        const players = this.getMatchComponent<PlayersComponent>(data.match_id, 'Players');

        if (!players) throw new Error("Couldn't get player info")


        for (const [opponent_id] of players.players) {
            //skip self
            if (opponent_id === player_id) continue;

            return opponent_id;
        }

    }
}