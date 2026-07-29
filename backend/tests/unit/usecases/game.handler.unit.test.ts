import { describe, it, expect, beforeEach, type Mock, vi} from 'vitest';
import { submitQuestion } from '../../../src/interface-adapters/socket-handlers/game.handler';
import { CheckAnswer } from '../../../src/application/usecases/check-answer';
import { PlayersComponent, LifeComponent } from '../../../src/entities/components';
import { SubmissionDTO } from '../../../src/entities/dtos/components.dto';

// Mock Helpers
const mockIo = () => {
    const emit = vi.fn();
    return {
        to: vi.fn().mockReturnValue({ emit }),
        _emit: emit,
    } as unknown as { to: Mock; _emit: Mock };
};

const mockSocket = (user_id: string) => ({
    data: { user_id },
} as any);

const mockCheckAnswer = (): CheckAnswer => ({
    execute: vi.fn(),
} as unknown as CheckAnswer);

const mockWorld = () => ({
    getMatchComponent: vi.fn(),
    getPlayerComponent: vi.fn(),
    getSubmissionComponent: vi.fn(),
    createEntity: vi.fn(),
    addPlayerComponent: vi.fn(),
    addMatchComponent: vi.fn(),
    addRoundComponent: vi.fn(),
    addSubmissionComponent: vi.fn(),
});

describe('submitQuestion socket handler', () => {
    let io: ReturnType<typeof mockIo>;
    let check_answer: CheckAnswer;
    let world: ReturnType<typeof mockWorld>;

    const data: SubmissionDTO = {
        match_id: 1,
        question_id: 'q1',
        answer: '42',
    } as SubmissionDTO;

    beforeEach(() => {
        io = mockIo();
        check_answer = mockCheckAnswer();
        world = mockWorld();
        vi.clearAllMocks();
    });

    it('emits submission_result to the submitting player', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce(true);
        (world.getMatchComponent as Mock).mockReturnValue(null);

        await submitQuestion(io as any, socket, data, check_answer, world as any);

        expect(check_answer.execute).toHaveBeenCalledWith( data.match_id, 'player-a', data.question_id, data.answer);
        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('submission_result', true);
    });

    it('broadcasts oppoonent_progress to the OTHER player in the match, not the submitter', async () => {
        const socket = mockSocket('player-a');

        const players: PlayersComponent = {
            players: new Map([ ['player-a', 1], ['player-b', 2], ]),
        };

        const opponentLife: LifeComponent = { current_life: 80, max_life: 100 };

        (check_answer.execute as Mock).mockResolvedValueOnce(true);
        (world.getMatchComponent as Mock).mockImplementation((_id: number, type: string) =>{
            if (type === 'Players') return players;
            return null;
        });
        (world.getPlayerComponent as Mock).mockImplementation((entity: number) => {
            return entity === 2 ? opponentLife : { current_life: 100, max_life: 100 };
        });

        await submitQuestion(io as any, socket, data, check_answer, world as any);

        //submitter gets their own result
        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('opponent_progress', {
            player_id: 'player-a',
            correct: true,
            opponent_life: 80,
        });

        //submitter should never receive an opponent_progress event about themselves
        expect(io.to).not.toHaveBeenCalledWith('player-a', expect.anything());
    });

    it('uses the injected world instance, not a freshly created one', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce(false);
        (world.getMatchComponent as Mock).mockReturnValueOnce(null);

        await submitQuestion(io as any, socket, data, check_answer, world as any);

        expect(world.getMatchComponent).toHaveBeenCalledWith(data.match_id, 'Players');

    });

    it('does nothing extra if Players component is missing (no opponent to notify)', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce(true);
        (world.getMatchComponent as Mock).mockReturnValueOnce(undefined);

        await submitQuestion(io as any, socket, data, check_answer, world as any);

        expect(io._emit).toHaveBeenCalledTimes(1);
        expect(io._emit).toHaveBeenCalledWith('submission_result', true);

    });

    it('handled opponent life being null/undeifined gracefully', async () => {
        const socket = mockSocket('player-a');

        const players: PlayersComponent = {
            players: new Map([ ['players-a', 1], ['player-b', 2], ]),
        };

        (check_answer.execute as Mock).mockResolvedValueOnce(true);
        (world.getMatchComponent as Mock).mockImplementation((_id: number, type: string) => {
            if (type === 'Players') return players;
            return null;
        });

        (world.getPlayerComponent as Mock).mockReturnValue(undefined);

        await submitQuestion(io as any, socket, data, check_answer, world as any);

        expect(io._emit).toHaveBeenCalledWith('opponent_progress', {
            player_id: 'player-a',
            correct: true,
            opponent_life: null,
        });
    });

    it('emits submission_error and does not throw when check)answer.execute rejects', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockRejectedValueOnce(new Error('Invalid question id'));

        await expect( submitQuestion(io as any, socket, data, check_answer, world as any) ).resolves.not.toThrow();

        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('submission_error', expect.any(Error));

        // world should never be queried if check_answer already failed
        expect(world.getMatchComponent).not.toHaveBeenCalled();

    });
});
