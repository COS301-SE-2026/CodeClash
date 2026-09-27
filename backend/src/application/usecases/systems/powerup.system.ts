import { match } from 'node:assert';
import { World } from '../../../entities/World';
import { LifeSystem } from './life.system';
import { SubmissionSystem } from './submission.system';
import { PowerupStateComponent, PlayerPowerupState } from 'src/entities/components';

const POSITIVE_EFFECTS = new Set([
    'reduce_time', 'reveal_hint', 'score_multiplier', 'restore_life', 'block_next_powerdown'
]);

const defaultState = (): PlayerPowerupState => ({
    shield_active: false,
    blocked_until: null,
    time_delta_seconds: 0,
    score_multiplier_percent: 0,
    wipe_used: false,
});

export interface ApplyPowerupResult {
    blocked: boolean;   // true if a shield absorbed a powerdown
    effect: string;
}

export class PowerupSystem {
    constructor(
        private readonly world: ReturnType<typeof World>,
        private readonly life_system: LifeSystem,
        private readonly submission_system: SubmissionSystem
    ){}

    private getState(match_id: number): PowerupStateComponent {
        let state = this.world.getMatchComponent<PowerupStateComponent>(match_id, 'PowerupState');
        if (!state) {
            state = {};
            this.world.addMatchComponent(match_id, 'PowerupState', state);
        }
        return state;
    }

    private getPlayerState(match_id: number, user_id: string): PlayerPowerupState {
        const state = this.getState(match_id);
        if (!state[user_id]) state[user_id] = defaultState();
        return state[user_id];
    }

    isPowerdown(effect: string): boolean {
        return !POSITIVE_EFFECTS.has(effect);
    }

    /**
     * actor_id = player who used the item
     * target_id = required for anything aimed at the opponent
     */
    apply(
        match_id: number,
        effect: string,
        metadata: Record<string, unknown>,
        actor_id: string,
        target_id?: string
    ): ApplyPowerupResult {
        if(this.isPowerdown(effect)) {
            if(!target_id) throw new Error('This effect requires a target_user_id');

            const target_state = this.getPlayerState(match_id, target_id);
            if (target_state.shield_active) {
                target_state.shield_active = false;
                return { blocked: true, effect };
            }
        }

        switch (effect) {
            case 'reduce_time':

            case 'increase_time':

            case 'cores_multiplier':

            case 'restore_life':

            case 'drain_life':

            case 'block_next_powerdown':

            case 'insert_bugs':

            case 'wipe_answer':

            case 'block_question':

            case 'reveal_hint':

            default:
                throw new Error(`Uknown powerup effect: ${effect}`);
        }
        return { blocked: false, effect };
    }

    isQuestionBlocked(match_id: number, user_id: string): boolean {

    }

    getTimeDeltaSeconds(match_id: number, user_id: string): number {

    }

    getScoreMultiplierPercent(match_id: number, user_id: string): number {

    }
}