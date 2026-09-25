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
        
    ){}

    private getState(match_id: string): PowerupStateComponent {

    }

    private getPlayerState(match_id: string, user_id: string): PlayerPowerupState {

    }

    isPowerdown(effect: string): boolean {
        return !POSITIVE_EFFECTS.has(effect);
    }

    /**
     * actor_id = player who used the item
     * target_id = required for anything aimed at the opponent
     */
    apply(
        
    ): ApplyPowerupResult {

    }

    isQuestionBlocked(match_id: string, user_id: string): boolean {

    }

    getTimeDeltaSeconds(match_id: string, user_id: string): number {

    }

    getScoreMultiplierPercent(match_id: string, user_id: string): number {
        
    }
}