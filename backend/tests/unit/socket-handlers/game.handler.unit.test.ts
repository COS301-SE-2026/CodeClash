import { describe, it, expect, beforeEach, type Mock, vi } from 'vitest';
import { submitQuestion } from '../../../src/interface-adapters/socket-handlers/game.handler';
import { MarkingService } from '../../../src/application/usecases/services/marking.service';
import { SubmissionDTO } from '../../../src/interface-adapters/dtos/components.dto';
import { OpponentProgress } from '../../../src/application/usecases/systems/opponent-progress'


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


const mockOpponentProgress = () => ({
    execute: vi.fn(),
    getMatchComponent: vi.fn(),
} as unknown as OpponentProgress)

describe('submitQuestion socket handler', () => {
    let io: ReturnType<typeof mockIo>;
    let check_answer: MarkingService;
    let opponent_progress: OpponentProgress

    const data: SubmissionDTO = {
        match_id: 1,
        question_id: 'q1',
        answer: '42',
        question_number: 2
    } as SubmissionDTO;

    beforeEach(() => {
        io = mockIo();
        check_answer = mockCheckAnswer();
        opponent_progress = mockOpponentProgress();
        vi.clearAllMocks();
    });

    it('emits submission_result to the submitting player', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce({
            player_id: 'player-a',
            result: true,
            life_update: 80
        });

        (opponent_progress.execute as Mock).mockReturnValue("player-b");

        await submitQuestion(io as any, socket, data, check_answer, opponent_progress);

        expect(check_answer.execute).toHaveBeenCalledWith(data.match_id, 'player-a', data.question_id, data.answer);
        expect(opponent_progress.execute).toHaveBeenCalledWith(data, 'player-a');
        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('submission_result', {
            player_id: 'player-a',
            result: true,
            life_update: 80
        });
    });

    it('broadcasts opponent_progress to the OTHER player in the match, not the submitter', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce({
            player_id: 'player-a',
            result: true,
            life_update: 80
        });

        (opponent_progress.execute as Mock).mockReturnValue("player-b");


        await submitQuestion(io as any, socket, data, check_answer, opponent_progress);

        //submitter gets their own result
        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('opponent_progress', {
            player_id: 'player-a',
            correct: true,
            opponent_life: 80,
            question: 2
        });

        //submitter should never receive an opponent_progress event about themselves
        expect(io.to).not.toHaveBeenCalledWith('player-a', expect.anything());
    });



    it('does nothing extra if Players component is missing (no opponent to notify)', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce({
            player_id: 'player-a',
            result: true,
            life_update: 80
        });

         await submitQuestion(io as any, socket, {}, check_answer, opponent_progress);

       
        expect(io._emit).toHaveBeenCalledWith('submission_result', {
            player_id: 'player-a',
            result: true,
            life_update: 80
        });

        
        expect(io._emit).toHaveBeenCalledWith('submission_error', expect.objectContaining({message: "Couldn't get opponent"}))
    });

 

    it('emits submission_error and does not throw when check_answer.execute rejects', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockRejectedValueOnce(new Error('Invalid question id'));

        await expect(submitQuestion(io as any, socket, data, check_answer,opponent_progress)).resolves.toBeUndefined()

        expect(io.to).toHaveBeenCalledWith('player-a');
        expect(io._emit).toHaveBeenCalledWith('submission_error', expect.any(Error));

    
    });
});
