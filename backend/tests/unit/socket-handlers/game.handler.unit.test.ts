import { describe, it, expect, beforeEach, type Mock, vi } from 'vitest';
import { submitQuestion } from '../../../src/interface-adapters/socket-handlers/game.handler';
import { MarkingService } from '../../../src/application/usecases/services/marking/marking.service';
import { MathsSubmissionDTO, PlayerSubmissionDTO} from '../../../src/entities/dtos/components.dto';

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

const mockCheckAnswer = (): MarkingService=> ({
    execute: vi.fn(),
} as unknown as MarkingService);

describe('submitQuestion socket handler', () => {
    let io: ReturnType<typeof mockIo>;
    let check_answer: MarkingService;

    const data: PlayerSubmissionDTO = {
        match_id: 1,
        player_id: 'player-a',
        question_id: 'q1',
        question_number: 2,
        submission: {
            answer: 'a1'
        }as MathsSubmissionDTO
    } as PlayerSubmissionDTO;

    beforeEach(() => {
        io = mockIo();
        check_answer = mockCheckAnswer();
        vi.clearAllMocks();
    });

    it('emits submission_result to the submitting player', async () => {
        const socket = mockSocket('player-a');

        await submitQuestion(io as any, socket, data, check_answer);

        expect(check_answer.execute).toHaveBeenCalledWith(data);
    });


    it('emits submission_error and does not throw when check_answer.execute rejects', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockRejectedValueOnce(new Error('Invalid question id'));

        await expect(submitQuestion(io as any, socket, data, check_answer)).resolves.toBeUndefined()

        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('submission_error', expect.any(Error));

    
    });
});
