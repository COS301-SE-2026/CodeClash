import { expect, vi, type Mock, describe, it, beforeEach, afterEach } from 'vitest'
import { MatchmakingService } from '../../../src/application/usecases/services/matchmaking.service'
import { MatchConfirmationService } from '../../../src/application/usecases/services/match/match-confirmation.service'
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository'
import { joinMatchQueue } from '../../../src/interface-adapters/socket-handlers/matchmaking-handlers'
import { ranked_maths_users } from '../../mocks/mock-user';

const mockIo = () => {
    const emit = vi.fn();
    const fetchSockets = vi.fn().mockResolvedValue([{}]);
    return {
        to: vi.fn().mockReturnValue({ emit }),
        in: vi.fn().mockReturnValue({ fetchSockets }),
        _emit: emit,
        _fetchSockets: fetchSockets
    } as unknown as { to: Mock; _emit: Mock; _fetchSockets: Mock };
};

const mockSocket = (user_id: string) => ({
    data: { user_id },
    join: vi.fn()
} as any);

const mockMatchmakingService = (): MatchmakingService => ({
    enqueue: vi.fn(),
    dequeue: vi.fn(),
    isQueued: vi.fn(),
    matchmaking: vi.fn(),


} as unknown as MatchmakingService);

const mockConfirmationService = (): MatchConfirmationService => ({
    create: vi.fn().mockReturnValue('group-1')
} as unknown as MatchConfirmationService)

const mockUserRepo = (): IUserRepository => ({
    getUserData: vi.fn()
} as unknown as IUserRepository)

describe('Matchmaking Socket Handlers', () => {
    let io: ReturnType<typeof mockIo>;
    let matchmaking_service: MatchmakingService;
    let confirmation_service: MatchConfirmationService;
    let user_repo: IUserRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        vi.useFakeTimers();
        io = mockIo();
        matchmaking_service = mockMatchmakingService();
        confirmation_service = mockConfirmationService();
        user_repo = mockUserRepo();
    })

    afterEach(() => {
        vi.clearAllMocks();
        vi.useRealTimers();
    })


    describe("Join Match Queue", () => {
        it("Adds a user to the queue", async () => {
            const socket = mockSocket('player001');
            const player_1 = ranked_maths_users[0];
            await joinMatchQueue(io as any, socket, player_1, matchmaking_service, confirmation_service, user_repo);

            expect(socket.join).toHaveBeenCalledWith('player001');
            expect(user_repo.getUserData).toHaveBeenCalledWith('player001', 'elo');
        })

        it("ignores requests with no valid elo", async () => {
            (user_repo.getUserData as Mock).mockResolvedValue(undefined);

            const socket = mockSocket('player001');
            const player_1 = { ...ranked_maths_users[0], elo: undefined };
            await joinMatchQueue(io as any, socket, player_1, matchmaking_service, confirmation_service, user_repo);

            expect(matchmaking_service.matchmaking).not.toHaveBeenCalled();
        })

        it("notifies both players when a match is found", async () => {

            const player_1 = ranked_maths_users[0];
            const player_2 = ranked_maths_users[1];

            (matchmaking_service.matchmaking as Mock).mockResolvedValue([
                { id: player_1.id, elo: player_1.elo },
                { id: player_2.id, elo: player_2.elo }
            ])

            const socket = mockSocket('player001');

            await joinMatchQueue(io as any, socket, player_1, matchmaking_service, confirmation_service, user_repo);

            expect(confirmation_service.create).toHaveBeenCalledTimes(1);
            expect(io.to).toHaveBeenCalledWith(player_1.id);
            expect(io.to).toHaveBeenCalledWith(player_2.id);
            expect(io._emit).toHaveBeenCalledWith('users_matched', expect.objectContaining({ group_id: 'group-1' }))
        })


        it("retries with wider window after 10s", async () => {
            const socket = mockSocket('player001');
            const player_1 = ranked_maths_users[0];

            (matchmaking_service.isQueued as Mock).mockResolvedValue(true);

            await joinMatchQueue(io as any, socket, player_1, matchmaking_service, confirmation_service, user_repo);

            expect(matchmaking_service.matchmaking).toHaveBeenCalledTimes(1);

            await vi.advanceTimersByTimeAsync(10000);
            expect(matchmaking_service.matchmaking).toHaveBeenCalledTimes(2);
            expect(matchmaking_service.matchmaking).toHaveBeenLastCalledWith(
                expect.objectContaining({ id: 'player001', match_attempt: 2 })
            )
        })

        it("stops retrying when a user leaves the queue", async () => {
            const socket = mockSocket('player001');
            const player_1 = ranked_maths_users[0];
            (matchmaking_service.isQueued as Mock).mockResolvedValue(false);

            await joinMatchQueue(io as any, socket, player_1, matchmaking_service, confirmation_service, user_repo);

            await vi.advanceTimersByTimeAsync(30000);
            expect(matchmaking_service.matchmaking).toHaveBeenCalledTimes(1);
            expect(io._emit).not.toHaveBeenCalled();
        })
    })


})