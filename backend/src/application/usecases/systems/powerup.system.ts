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
                this.getPlayerState(match_id, actor_id).time_delta_seconds -= metadata.value_seconds as number;
                break;

            case 'increase_time':
                this.getPlayerState(match_id, target_id!).time_delta_seconds += metadata.value_seconds as number;
                break;

            case 'score_multiplier':
                this.getPlayerState(match_id, actor_id).score_multiplier_percent += metadata.value_percent as number;
                break;

            case 'restore_life':
                this.life_system.adjustLife(match_id, actor_id, metadata.value as number);
                break;

            case 'drain_life':
                this.life_system.adjustLife(match_id, target_id!, metadata.value as number);
                break;

            case 'block_next_powerdown':
                this.getPlayerState(match_id, actor_id).shield_active = true;
                break;

            case 'insert_bugs':
                // client side mangling of current input
                break;

            case 'wipe_answer': {
                const target_state = this.getPlayerState(match_id,target_id!);
                if (target_state.wipe_used) throw new Error('Wipe already used this match');
                target_state.wipe_used = true;
                // client side clearing of input
                break;
            }

            case 'block_question': {
                const duration_ms = (metadata.duration_seconds as number) * 1000;
                this.getPlayerState(match_id, target_id!).blocked_until = Date.now() + duration_ms;
                break;
            }

            case 'reveal_hint':
                // No server state to mutate. Handled by socket
                break;


            default:
                throw new Error(`Uknown powerup effect: ${effect}`);
        }
        return { blocked: false, effect };
    }

    isQuestionBlocked(match_id: number, user_id: string): boolean {
        const state = this.getPlayerState(match_id, user_id);
        if (!state.blocked_until) return false;
        if (Date.now() >= state.blocked_until) {
            state.blocked_until = null;
            return false;
        }
        return true;
    }

    getTimeDeltaSeconds(match_id: number, user_id: string): number {

    }

    getScoreMultiplierPercent(match_id: number, user_id: string): number {

    }
}