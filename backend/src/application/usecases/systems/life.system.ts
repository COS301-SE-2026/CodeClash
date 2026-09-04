import { LifeComponent } from "src/entities/components";
import { World } from "src/entities/World";
import { MatchComponent, PlayersComponent } from "src/entities/components";


export class LifeSystem {
    private readonly getPlayerComponents;
    private readonly getMatchComponent;

    constructor(
        private readonly world: ReturnType<typeof World>

    ) {
        const { getPlayerComponent,getMatchComponent } = this.world
        this.getPlayerComponents = getPlayerComponent;
        this.getMatchComponent = getMatchComponent;
    }

    decrement(player_entity: number, question_number: number) {
        const life = this.getPlayerComponents<LifeComponent>(player_entity, 'Life');

        if (!life) throw new Error('Error updating player life')

        if (question_number <= 0) {
            return life.current_life;
        }

        const change = life.max_life / (question_number * 3);
        life.current_life -= change;
        if (life.current_life < 0) life.current_life = 0

        return life.current_life;
    }

    increment(player_entity: number, question_number: number) {
        const life = this.getPlayerComponents<LifeComponent>(player_entity, 'Life');

        if (!life) throw new Error('Error updating player life')

        if (question_number <= 0) {
            return life.current_life;
        }

        if (life.current_life === life.max_life) return life.current_life;

        const change = life.max_life / question_number;
        life.current_life += change;

        return life.current_life
    }

    getCurrentLife(player_entity: number) {
        const life = this.getPlayerComponents<LifeComponent>(player_entity, 'Life');
        if (!life) throw new Error('Error getting player life')

        return life.current_life
    }

    updatePlayerLife(match_id: number, player_id: string, correct: boolean) {
        const match = this.getMatchComponent<MatchComponent>(match_id, 'Match');
        const players = this.getMatchComponent<PlayersComponent>(match_id, 'Players');

        const player_entity = players!.players.get(player_id);

        if (player_entity === undefined) throw new Error("Invalid Player");

        let life_update = this.getCurrentLife(player_entity);

        if (!correct) life_update = this.decrement(player_entity, match!.question_number);

        return life_update;

    }
}