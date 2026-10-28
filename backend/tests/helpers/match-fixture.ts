/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DataSource } from 'typeorm';
import { Users } from '../../src/entities/database/user.entities';
import { Matches } from '../../src/entities/database/match.entities';
import { Wallet } from '../../src/entities/database/wallet.entities';
import { Achievement } from '../../src/entities/database/achievement.entities';
import { World } from '../../src/entities/World';
import type { SubmissionComponent, SubmissionRegistryComponent } from '../../src/entities/components';
import { MatchMode, MatchType } from '../../src/entities/dtos/matches/match.dto';
import { UserRepository } from '../../src/interface-adapters/repositories/user.repository';
import { MatchRepository } from '../../src/interface-adapters/repositories/match.repository';
import { WalletRepository } from '../../src/interface-adapters/repositories/wallet.repository';
import { AchievementRepository } from '../../src/interface-adapters/repositories/achievement.repository';
import { AchievementService } from '../../src/application/usecases/services/achievement.service';
import { LifeSystem } from '../../src/application/usecases/systems/life.system';
import { PowerupSystem } from '../../src/application/usecases/systems/powerup.system';
import { MatchCompletionSystem } from '../../src/application/usecases/systems/match-completion.system';
import { MatchStore } from '../../src/application/usecases/services/match/match-store.service';
import { MatchCompletionService } from '../../src/application/usecases/services/match/match-completion.service';
import { RewardService } from '../../src/application/usecases/services/match/reward.service';

export const START = new Date('2026-01-01T00:00:00Z');
export const ROUNDS: any = [{ round_number: 0, questions: [{ id: 'q1' }, { id: 'q2' }] }];

// ADJUST these constructor calls if your repositories take different arguments
export const buildDeps = (ds: DataSource) => {
    const users = ds.getRepository(Users);
    const user_repo = new UserRepository(users as any);
    const match_repo = new MatchRepository(ds.getRepository(Matches), user_repo as any);
    const wallet_repo = new WalletRepository(ds.getRepository(Wallet));
    const achievement_repo = new AchievementRepository(ds.getRepository(Achievement) as any, users as any);
    const achievement_service = new AchievementService(achievement_repo as any, user_repo as any);
    return { user_repo, match_repo, wallet_repo, achievement_repo, achievement_service };
};
export type Deps = ReturnType<typeof buildDeps>;

let n = 0;
export const createUser = (ds: DataSource) => {
    n++;
    return ds.getRepository(Users).save({ cognito_id: `fx-c-${n}`, username: `fx_user_${n}`, email: `fx${n}@test.com`, avatar_id: 0 });
};

export const seedAchievements = (ds: DataSource, names: string[]) =>
    ds.getRepository(Achievement).save(names.map(achievement_name => ({ achievement_name, description: 'test' })));

// reads the real world, so the powerup system sees the same submissions the completion system does
export const submissionAdapter = (world: ReturnType<typeof World>) => ({
    playerSubmissions: (match_id: number, player_id: string): SubmissionComponent[] => {
        const reg = world.getMatchComponent<SubmissionRegistryComponent>(match_id, 'Submission');
        const out: SubmissionComponent[] = [];
        for (const [key, entity] of reg?.submissions ?? []) {
            if (key.split('::')[0] !== player_id) continue;
            const c = world.getSubmissionComponent(entity, 'Submission');
            if (c) out.push(c);
        }
        return out;
    },
});

export const buildSystems = (world: ReturnType<typeof World>, user_repo: any) => {
    const life = new LifeSystem(world);
    const submissions = submissionAdapter(world);
    const powerup = new PowerupSystem(world, life, submissions as any);
    const store = new MatchStore(user_repo);
    const completion = new MatchCompletionSystem(world, store, undefined, powerup);
    return { life, powerup, store, completion, submissions };
};

export const createEcsMatch = (world: ReturnType<typeof World>, ids: string[], match_type = MatchType.casual) => {
    const match = world.createEntity();
    world.addMatchComponent(match, 'Match', {
        title: 't', status: 'in_progress', game_mode: 'math', match_type, winner: 0,
        rounds: [], start_time: START, end_time: new Date(START.getTime() + 600_000), question_number: 1,
    });
    const players = new Map<string, number>();
    for (const id of ids) {
        const e = world.createEntity();
        world.addPlayerComponent(e, 'Life', { current_life: 100, max_life: 100 });
        world.addPlayerComponent(e, 'Info', { id, elo: 600 });
        players.set(id, e);
    }
    world.addMatchComponent(match, 'Players', { players });
    world.addMatchComponent(match, 'Submission', { submissions: new Map() });
    return match;
};

export const addSubmission = (
    world: ReturnType<typeof World>, match: number, player_id: string,
    question_id: string, offset_ms: number, correct: boolean
) => {
    const entity = world.createEntity();
    world.addSubmissionComponent(entity, 'Submission', {
        match_id: match, player_id, question_id, round_number: 0, question_number: 0,
        started_at: START, attempt_number: 1, answer: null,
        submitted_at: new Date(START.getTime() + offset_ms), correct, token: undefined,
    });
    world.getMatchComponent<SubmissionRegistryComponent>(match, 'Submission')!
        .submissions.set(`${player_id}::${question_id}`, entity);
};

// a full match in the DB + world. Winner: 2 correct, loser: 1 correct
export const makeMatchContext = async (ds: DataSource, deps: Deps, type: MatchType) => {
    const w = await createUser(ds);
    const l = await createUser(ds);
    const world = World();
    const sys = buildSystems(world, deps.user_repo);
    const ecs = createEcsMatch(world, [w.user_id, l.user_id], type);
    const db_id = await deps.match_repo.createMatch([w.user_id, l.user_id], type, MatchMode.Maths, START, 'integration', []);
    await sys.store.create(ecs, db_id, [{ id: w.user_id, elo: 600 }, { id: l.user_id, elo: 600 }] as any, ROUNDS, new Date(START.getTime() + 600_000));

    addSubmission(world, ecs, w.user_id, 'q1', 1000, true);
    addSubmission(world, ecs, w.user_id, 'q2', 2000, true);
    addSubmission(world, ecs, l.user_id, 'q1', 1500, true);
    addSubmission(world, ecs, l.user_id, 'q2', 2500, false);

    const service = new MatchCompletionService(
        deps.match_repo as any, sys.completion, deps.user_repo as any, deps.achievement_service,
        new RewardService(), deps.wallet_repo as any, sys.powerup
    );
    return { w, l, world, ecs, db_id, sys, service, ids: [w.user_id, l.user_id] };
};