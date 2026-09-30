import { MatchmakingUserDTO } from '../../../../src/entities/dtos/matchmaking/matchmaking.dto';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MatchmakingService } from '../../../../src/application/usecases/services/matchmaking.service'
import { MatchMode } from '../../../../src/entities/dtos/matches/match.dto';

const mock_user = (data: Partial<MatchmakingUserDTO> = {}): MatchmakingUserDTO => ({
    id: 'user-1',
    elo: 1000,
    match_mode: MatchMode.Maths,
    match_attempt: 1,
    joined_at: new Date(),
    ...data
});

let mock_cache: {
    enqueue: ReturnType<typeof vi.fn>,
    dequeue: ReturnType<typeof vi.fn>,
    getPlayers: ReturnType<typeof vi.fn>,
    getJoinedAt: ReturnType<typeof vi.fn>,
    getUserElo: ReturnType<typeof vi.fn>,
    getQueueLength: ReturnType<typeof vi.fn>,
    deleteUser: ReturnType<typeof vi.fn>,
    incrementMatchAttempt: ReturnType<typeof vi.fn>
};

let service: MatchmakingService;

describe('MatchmakingService', () => {
    beforeEach(() => {
        mock_cache = {
            enqueue: vi.fn().mockResolvedValue(undefined),
            dequeue: vi.fn().mockResolvedValue(true),
            getPlayers: vi.fn(),
            getJoinedAt: vi.fn(),
            getUserElo: vi.fn(),
            getQueueLength: vi.fn(),
            deleteUser: vi.fn().mockResolvedValue(1),
            incrementMatchAttempt: vi.fn().mockResolvedValue(undefined)
        };

        service = new MatchmakingService(mock_cache as any);
    })

    it("enqueues user when a match isn't found", async () => {
        mock_cache.getPlayers.mockResolvedValue([]);
        mock_cache.getUserElo.mockResolvedValue(null);

        const user = mock_user();
        const result = await service.matchmaking(user);

        expect(result).toBeNull();
        expect(mock_cache.enqueue).toHaveBeenCalledWith(user.match_mode, user);
    })

    it("increases users match attempt if they're already waiting", async () => {
        mock_cache.getPlayers.mockResolvedValue([]);
        mock_cache.getUserElo.mockResolvedValue(1000);

        const user = mock_user();
        const result = await service.matchmaking(user);

        expect(result).toBeNull();
        expect(mock_cache.enqueue).not.toHaveBeenCalled();
        expect(mock_cache.incrementMatchAttempt).toHaveBeenCalledWith(user.id);
    })

    it("excludes the requesting user from thei own candidate list", async () => {
        mock_cache.getPlayers.mockResolvedValue(['user-1']);
        mock_cache.getJoinedAt.mockResolvedValue(['2026-09-15T08:56:42.467Z']);
        mock_cache.getUserElo.mockResolvedValue(1000);

        const user = mock_user({ id: 'user-1' });
        const result = await service.matchmaking(user);

        expect(result).toBeNull();
        expect(mock_cache.enqueue).not.toHaveBeenCalled();
    })

    it('matches two players', async () => {
        mock_cache.getPlayers.mockResolvedValue(['user-2']);
        mock_cache.getJoinedAt.mockResolvedValue(['2026-09-17T08:56:42.467Z']);
        mock_cache.getUserElo.mockResolvedValue(950);

        const user = mock_user({ id: 'user-1', elo: 1000 });
        const result = await service.matchmaking(user);

        expect(result).toEqual([
            { id: 'user-1', elo: 1000 },
            { id: 'user-2', elo: 950 }
        ])
        expect(mock_cache.deleteUser).toHaveBeenCalledWith(user.match_mode, 'user-2');
        expect(mock_cache.deleteUser).toHaveBeenCalledWith(user.match_mode, 'user-1');
    })


    it('matches more than two players', async () => {
        mock_cache.getPlayers.mockResolvedValue(['user-2', 'user-3', 'user-4']);
        mock_cache.getJoinedAt
            .mockResolvedValueOnce(['2026-09-17T08:56:42.467Z'])
            .mockResolvedValueOnce(['2026-09-17T09:00:42.467Z'])
            .mockResolvedValueOnce(['2026-09-17T09:03:42.467Z']);

        mock_cache.getUserElo
            .mockResolvedValueOnce(940)
            .mockResolvedValueOnce(990)
            .mockResolvedValueOnce(1010);

        const user = mock_user({ id: 'user-1', elo: 1000 });
        const result = await service.matchmaking(user, 4);

        expect(result).toHaveLength(4);
        expect(result).toEqual(expect.arrayContaining([
            { id: 'user-1', elo: 1000 },
            { id: 'user-2', elo: 940 },
            { id: 'user-3', elo: 990 },
            { id: 'user-4', elo: 1010 },
        ]))
    })

    it("waits for more players when the minimum isn't met", async () => {
        mock_cache.getPlayers.mockResolvedValue(['user-2']);
        mock_cache.getJoinedAt.mockResolvedValue(['2026-09-17T08:56:42.467Z']);
        mock_cache.getUserElo.mockResolvedValue(null);

        const user = mock_user({ id: 'user-1' });
        const result = await service.matchmaking(user, 4);

        expect(result).toBeNull();
        expect(mock_cache.enqueue).toHaveBeenCalled();

    })

})