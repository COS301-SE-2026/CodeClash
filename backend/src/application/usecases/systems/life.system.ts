import { LifeComponent } from "src/entities/components";
import { World } from "src/entities/World"


export class LifeSystem {
    private readonly getPlayerComponents
    constructor(
        private readonly world: ReturnType<typeof World>

    ) {
        const { getPlayerComponent } = this.world
        this.getPlayerComponents = getPlayerComponent
    }

    decrement(player_entity: number, question_number: number) {
        const life = this.getPlayerComponents<LifeComponent>(player_entity, 'Life');

        if (!life) throw new Error('Error updating player life')

        const change = life.max_life / question_number;
        life.current_life -= change;
        if (life.current_life < 0) life.current_life = 0

        return life.current_life;
    }

    increment(player_entity: number, question_number: number) {
        const life = this.getPlayerComponents<LifeComponent>(player_entity, 'Life');

        if (!life) throw new Error('Error updating player life')
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
}