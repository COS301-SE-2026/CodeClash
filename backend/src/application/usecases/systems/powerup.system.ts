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