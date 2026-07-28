import { World } from "src/entities/World";
import { PlayersComponent, LifeComponent } from "src/entities/components";
import { SubmissionDTO } from "src/entities/dtos/components.dto";


export class OpponentProgress {

    private readonly getMatchComponent;
    private readonly getPlayerComponent
    constructor(
        private readonly world: ReturnType<typeof World>
    ) {
        const { getMatchComponent, getPlayerComponent } = this.world

        this.getMatchComponent = getMatchComponent;
        this.getPlayerComponent = getPlayerComponent;

    }

    execute(data: SubmissionDTO, player_id: string) {
        const players = this.getMatchComponent<PlayersComponent>(data.match_id, 'Players');


        if (!players) throw new Error("Couldn't get player info")

        let opponent: string = '';
        let opponent_life: number = 0;

        for (const [opponent_id, opponent_entity] of players.players) {
            //skip self
            if (opponent_id === player_id) continue;

            const life = this.getPlayerComponent<LifeComponent>(opponent_entity, 'Life');

            if (!life) throw new Error("Couldn't get opponent life");

            opponent = opponent_id;
            opponent_life = life.current_life;
        }

        return {
            opponent: opponent,
            opponent_life: opponent_life
        }
    }
}