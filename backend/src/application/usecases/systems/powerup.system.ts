import { PowerupMetadata } from 'src/entities/dtos/shop/shop.dto';
import { World } from '../../../entities/World';
import { LifeSystem } from './life.system';
import { SubmissionSystem } from './submission.system';
import { PowerupStateComponent, PlayerPowerupState } from 'src/entities/components';
import { HttpError } from 'src/entities/errors/http-error';
import { number } from 'mathjs';

const POSITIVE_EFFECTS = new Set([
    'reduce_time', 'score_multiplier', 'restore_life', 'block_next_powerdown'
]);

const defaultState = (): PlayerPowerupState => ({
    shield_active: false,
    blackout_question_id: null,
    time_delta_seconds: 0,
    score_multiplier_percent: 0,
    wipe_used: false,
});

export interface ApplyPowerupResult {
    blocked: boolean;   // true if a shield absorbed a powerdown
    effect: string;
    question_id?: string;
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

    private unanswered(match_id: number, target_id: string, question_ids: string[]): string[] {
        const answered = new Set(this.submission_system.playerSubmissions(match_id, target_id).map(s => s.question_id));
        return question_ids.filter(id => !answered.has(id));
    }

    isPowerdown(effect: string): boolean {
        return !POSITIVE_EFFECTS.has(effect);
    }
    
    validate(match_id: number, effect: string, target_id?: string, question_ids: string[] = []): void {
        if (effect === 'wipe_answer' && target_id && this.getPlayerState(match_id, target_id).wipe_used) {
            throw new HttpError(409, 'Wipe already used this match');
        }
            if (effect === 'blackout_question' && target_id) {
            if (this.getPlayerState(match_id, target_id).blackout_question_id)
                throw new HttpError(409, 'A question is already blacked out');
            if (this.unanswered(match_id, target_id, question_ids).length === 0)
                throw new HttpError(409, 'Opponent has no unanswered questions left');
        }
    }

    /**
     * actor_id = player who used the item
     * target_id = required for anything aimed at the opponent
     */
    apply(
        match_id: number,
        effect: string,
        metadata: PowerupMetadata,
        actor_id: string,
        target_id?: string,
        question_ids: string[]=[]
    ): ApplyPowerupResult {
        if(this.isPowerdown(effect)) {
            const target_state = this.getPlayerState(match_id, target_id!);
            // if(target_state.wipe_used) throw new HttpError(409, 'Wipe already used');

            if (target_state.shield_active) {
                target_state.shield_active = false;
                return { blocked: true, effect };
            }
        }

        switch (effect) {
            case 'reduce_time':
                this.getPlayerState(match_id, actor_id).time_delta_seconds -= metadata.value!;
                break;

            case 'increase_time':
                this.getPlayerState(match_id, target_id!).time_delta_seconds += metadata.value!;
                break;

            case 'score_multiplier':
                this.getPlayerState(match_id, actor_id).score_multiplier_percent += metadata.value!;
                break;

            case 'restore_life': {
                this.life_system.adjustLife(match_id, actor_id, metadata.value!);
                break;
            }

            case 'drain_life':{
                const life = this.life_system.getPlayerLife(match_id, target_id!);
                this.life_system.adjustLife(match_id, target_id!, -Math.min(metadata.value!, Math.max(life - 1, 0)));
                break;
            }

            case 'block_next_powerdown':
                this.getPlayerState(match_id, actor_id).shield_active = true;
                break;

            case 'insert_bugs':
                // client side mangling of current input
                break;

            case 'wipe_answer': {
                const target_state = this.getPlayerState(match_id,target_id!);
                // if (target_state.wipe_used) throw new HttpError(409,'Wipe already used this match');
                target_state.wipe_used = true;
                // client side clearing of input
                break;
            }

            case 'blackout_question': {
                const pool = this.unanswered(match_id, target_id!, question_ids);
                const pick = pool[Math.floor(Math.random() * pool.length)]!;
                this.getPlayerState(match_id, target_id!).blackout_question_id = pick;
                return { blocked: false, effect, question_id: pick }
            }

            // removed hints. We're no longer using them

            default:
                throw new Error(`Unknown powerup effect: ${effect}`);
        }
        return { blocked: false, effect };
    }

    getTimeDeltaSeconds(match_id: number, user_id: string): number {
        return this.getPlayerState(match_id, user_id).time_delta_seconds;
    }

    getScoreMultiplierPercent(match_id: number, user_id: string): number {
        return this.getPlayerState(match_id, user_id).score_multiplier_percent;
    }

    getClientState(match_id: number, user_id: string) { 
        const s= this.getPlayerState(match_id, user_id);
        return { shield_active: s.shield_active, blackout_question_id: s.blackout_question_id };
    }
}