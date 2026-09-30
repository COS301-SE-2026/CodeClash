import { describe, it, expect, beforeEach, type Mock, vi } from 'vitest';
import { submitQuestion } from '../../../src/interface-adapters/socket-handlers/match-handlers';
import { MarkingService } from '../../../src/application/usecases/services/marking/marking.service';
import { MathsSubmissionDTO, PlayerSubmissionDTO, RawSubmissionDTO } from '../../../src/entities/dtos/submissions/submission.dto';
import { MatchStore } from '../../../src/application/usecases/services/match/match-store.service'
import { TournamentEliminationService } from '../../../src/application/usecases/services/tournament/elimination.service'
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';
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

const mockCheckAnswer = (): MarkingService => ({
    execute: vi.fn(),
} as unknown as MarkingService);

const mockMatchStore = () => ({
    getEcsId: vi.fn().mockReturnValue(1)
} as unknown as MatchStore)

const mockElimination = () => ({} as any)

const mockOpponentPorgress = () => ({
    getOpponentId: vi.fn().mockReturnValue(undefined),
    updateOpponent: vi.fn().mockReturnValue({})
} as unknown as OpponentProgress);


describe('submitQuestion socket handler', () => {
    let io: ReturnType<typeof mockIo>;
    let check_answer: MarkingService;
    let match_store: MatchStore;
    let elimination: TournamentEliminationService;
    let opponent_progress: OpponentProgress

    const data: RawSubmissionDTO = {
        id: 1,
        player_id: 'player-a',
        question_id: 'q1',
        question_number: 2,
        submission: {
            answer: 'a1'
        } as MathsSubmissionDTO,
        match_mode: MatchMode.Maths,
        match_type: MatchType.ranked,
        round_number: 1
    } as unknown as RawSubmissionDTO;

    beforeEach(() => {
        vi.clearAllMocks();
        io = mockIo();
        check_answer = mockCheckAnswer();
        match_store = mockMatchStore();
        elimination = mockElimination();
        opponent_progress = mockOpponentPorgress();

    });

    it('emits submission_result to the submitting player', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockResolvedValueOnce({
            playaer_id: 'player-a',
            correct: true,
            speec: 0,
            attempt_number: 1,
            life_update: 100
        })
       await submitQuestion(io as any, socket, data, check_answer, match_store, elimination, opponent_progress);

        expect(check_answer.execute).toHaveBeenCalledWith({
            ...data,
            match_id: 1,
            player_id: socket.data.user_id
        });
    });


    it('emits submission_error and does not throw when check_answer.execute rejects', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockRejectedValueOnce(new Error('Invalid question id'));

        await expect(submitQuestion(io as any, socket, data, check_answer, match_store, elimination, opponent_progress)).rejects.toThrow('Invalid question id')
    });
});
