import { describe, it, expect, beforeEach, type Mock, vi } from 'vitest';
import { submitQuestion } from '../../../src/interface-adapters/socket-handlers/match-handlers';
import { MarkingService } from '../../../src/application/usecases/services/marking/marking.service';
import { MathsSubmissionDTO, PlayerSubmissionDTO, RawSubmissionDTO } from '../../../src/entities/dtos/submissions/submission.dto';
import { MatchStore } from '../../../src/application/usecases/services/match/match-store.service'
import {TournamentEliminationService} from '../../../src/application/usecases/services/tournament/elimination.service'
import { MatchMode, MatchType } from '../../../src/entities/dtos/matches/match.dto';

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


describe('submitQuestion socket handler', () => {
    let io: ReturnType<typeof mockIo>;
    let check_answer: MarkingService;
    let match_store: MatchStore;
    let elimination: TournamentEliminationService;

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
        io = mockIo();
        check_answer = mockCheckAnswer();
        match_store = mockMatchStore();
        elimination = mockElimination();
        vi.clearAllMocks();
    });

    it('emits submission_result to the submitting player', async () => {
        const socket = mockSocket('player-a');

        await submitQuestion(socket, data, check_answer, match_store, elimination);

        expect(check_answer.execute).toHaveBeenCalledWith({
            ...data,
            match_id: 1,
            player_id: socket.data.user_id
        });
    });


    it('emits submission_error and does not throw when check_answer.execute rejects', async () => {
        const socket = mockSocket('player-a');

        (check_answer.execute as Mock).mockRejectedValueOnce(new Error('Invalid question id'));

        await expect(submitQuestion(socket, data, check_answer,  match_store, elimination)).rejects.toThrow('Invalid question id')
    });
});
