import { vi, Mock, describe, beforeEach, it, expect } from 'vitest';
import { joinMatchQueue, leaveMatchQueue, matchAccepted, matchDeclined, sendGameQuestions, sendGamePlayers } from '../../../src/interface-adapters/socket-handlers/matchmaking.handler';
import { Socket } from 'socket.io';

// mocks

const mockEmit = vi.fn();
const  mockJoin = vi.fn();
const mockTo = vi.fn();

const mockIo = { to: mockTo } as any;

const mockSocket = {
    data: { user_id: 'user-1', game_mode: 'ranked' },
    join: mockJoin,
    to: mockTo,
    emot: mockEmit
} as any;

const mockMatchmakingService = {
    matchmaking: vi.fn(),
    dequeue: vi.fn()
} as any;

const mockUserRepo = {
    getUserData: vi.fn()
} as any;

const mockMatchedUsersService = {
    create: vi.fn(),
    accept: vi.fn(),
    bothAccepted: vi.fn(),
    getPlayers: vi.fn(),
    getKeys: vi.fn(),
    decline: vi.fn()
} as any;

const mockGameService = {
    execute: vi.fn()
} as any;

const mockGameStore = {
    create: vi.fn(),
    get: vi.fn()
} as any;

describe('joinMatchQueue', () => {
    beforeEach(() => vi.clearAllMocks());

    it('joins socket room with user_id', async () => {
        mockMatchmakingService.matchmaking.mockResolvedValueOnce(null);

        await joinMatchQueue(mockIo, mockSocket, { elo: 600, game_mode: 'ranked' }, mockMatchmakingService, mockMatchedUsersService, mockUserRepo);

        expect(mockJoin).toHaveBeenCalledWith('user-1');
    });

    it('returns early if no match found', async () => {
        mockMatchmakingService.matchmaking.mockResolvedValueOnce(null);

        await joinMatchQueue(mockIo, mockSocket, { elo: 600, game_mode: 'ranked' }, mockMatchmakingService, mockMatchedUsersService, mockUserRepo);

        expect(mockMatchedUsersService.create).not.toHaveBeenCalled();
        expect(mockTo).not.toHaveBeenCalled();

    });

    it('creates pair and emits users_matched to both players when match found', async () =>{
        const match = {
            player_1: { id: 'user-1', elo: 600 },
            player_2: { id: 'user-2', elo: 620 }
        };
        mockMatchmakingService.matchmaking.mockResolvedValueOnce(match);
        mockMatchedUsersService.create.mockReturnValueOnce('pair-123');
        mockUserRepo.getUserData.mockResolvedValueOnce({ username: 'alice' }).mockResolvedValueOnce({ username: 'bob' });
        
        await joinMatchQueue(mockIo, mockSocket, { elo: 600, game_mode: 'ranked' }, mockMatchmakingService, mockMatchedUsersService, mockUserRepo);

        expect(mockMatchedUsersService.create).toHaveBeenCalledWith(match);
        expect(mockTo).toHaveBeenCalledWith('user-1');
        expect(mockTo).toHaveBeenCalledWith('user-2');
        expect(mockEmit).toHaveBeenCalledWith('users_matched', expect.objectContaining({
            pair_id: 'pair-123',
            game_mode: 'ranked',
            players: {
                player_1: { id: 'user-1', elo: 600, username: 'alice' },
                player_2: { id: 'user-2', elo: 620, username: 'bob' }
            }
        }));

    });

    it('fetched usernames for both matched players', async () => {
        const match = {
            player_1: { id: 'user-1', elo: 600 },
            player_2: { id: 'user-2', elo: 620 }
        };

        mockMatchmakingService.matchmaking.mockResolvedValueOnce(match);
        mockMatchedUsersService.create.mockReturnValueOnce('pair-123');
        mockUserRepo.getUserData.mockResolvedValueOnce({ username: 'alice' }).mockResolvedValueOnce({ username: 'bob' });

        await joinMatchQueue(mockIo, mockSocket, { elo: 600, game_mode: 'ranked' }, mockMatchmakingService, mockMatchedUsersService, mockUserRepo);

        expect(mockUserRepo.getUserData).toHaveBeenCalledWith('user-1', 'username');
        expect(mockUserRepo.getUserData).toHaveBeenCalledWith('user-2', 'username');
    });
});

describe('leaveMatchQueue', () => {
    beforeEach(() => vi.clearAllMocks());

    it('emits user_dequeuedwhen dequeue succeeds', async () => {
        mockMatchmakingService.dequeue.mockResolvedValueOnce(true);

        await leaveMatchQueue(mockIo, mockSocket, mockMatchmakingService);

        expect(mockMatchmakingService.dequeue).toHaveBeenCalledWith('user-1', 'ranked');
        expect(mockTo).toHaveBeenCalledWith('user-1');
        expect(mockEmit).toHaveBeenCalledWith('user_dequeued');
    });

    it('emits dequeue-failed when dequeue returns false', async () => {
        mockMatchmakingService.dequeue.mockResolvedValueOnce(false);

        await leaveMatchQueue(mockIo, mockSocket, mockMatchmakingService);

        expect(mockEmit).toHaveBeenCalledWith('dequeue-failed');
    });
});

describe('matchAccepted', () => {
    beforeEach(() => vi.clearAllMocks());

    const data = {
        pair_id: 'pair-123',
        game_mode: 'ranked',
        league: 'earth',
        game_type: 'math'
    };

    it('calls accept with pair_id and user_id', async () => {
        mockMatchedUsersService.bothAccepted.mockReturnValueOnce(false);

        await matchAccepted(mockIo, mockSocket, data, mockGameService, mockMatchedUsersService, mockGameStore);

        expect(mockMatchedUsersService.accpet).toHaveBeenCalledWith('pair-123', 'user-1');
    });

    it('does not start game if both have not accepted', async () => {
        mockMatchedUsersService.bothAccepted.mockReturnValueOnce(false);

        await matchAccepted(mockIo, mockSocket, data, mockGameService, mockMatchedUsersService, mockGameStore);

        expect(mockGameService.execute).not.toHaveBeenCalled();
        expect(mockGameStore.create).not.toHaveBeenCalled();
    });

    it('starts game and emits start_game to all players when both accept', async () => {
        mockMatchedUsersService.bothAccepted.mockReturnValueOnce(true);
        mockMatchedUsersService.getPlayers.mockResolvedValueOnce([ { id: 'user-1' }, { id: 'user-2' }]);
        mockMatchedUsersService.getKeys.mockReturnValueOnce(['user-1', 'user-2']);
        mockGameService.execute.mockResolvedValueOnce({
            match_entity: 42,
            match_id: 'match-uuid',
            questions: ['q1', 'q2']
        });
        mockGameStore.create.mockResolvedValueOnce(undefined);

        await matchAccepted(mockIo, mockSocket, data, mockGameService, mockMatchedUsersService, mockGameStore);

        expect(mockGameService.execute).toHaveBeenCalledWith(expect.any(Array), 'ranked', 'earth', 'math');
        expect(mockGameStore.create).toHaveBeenCalledWith(42, 'match-uuid', expect.any(Array), ['q1','q2']);
        expect(mockEmit).toHaveBeenCalledWith('start_game', { game_id: 42 });
    });

    it('emits start_game to each player key', async () =>{
        mockMatchedUsersService.bothAccepted.mockReturnValueOnce(true);
        mockMatchedUsersService.getPlayers.mockResolvedValueOnce([ { id: 'user-1' }, { id: 'user-2' }]);
        mockMatchedUsersService.getKeys.mockReturnValueOnce(['user-1', 'user-2']);
        mockGameService.execute.mockResolvedValueOnce({
            match_entity: 42,
            match_id: 'match-uuid',
            questions: []
        });
        mockGameStore.create.mockResolvedValueOnce(undefined);

        await matchAccepted(mockIo, mockSocket, data, mockGameService, mockMatchedUsersService, mockGameStore);

        expect(mockTo).toHaveBeenCalledWith('user-1');
        expect(mockTo).toHaveBeenCalledWith('user-2');
    });
});

describe('matchDeclined', () => {
    beforeEach(() => vi.clearAllMocks());

    it('calls decline with pair_id', () => {
        mockMatchedUsersService.decline.mockReturnValueOnce(undefined);
        mockMatchedUsersService.getPlayers.mockResolvedValueOnce(null);

        matchDeclined(mockIo, mockSocket, 'pair-123', mockMatchedUsersService);

        expect(mockMatchedUsersService.decline).toHaveBeenCalledWith('pair-123');
    });

    it('emits decline_done to decliner and game_declined to other player', () => {
        mockMatchedUsersService.decline.mockReturnValueOnce(undefined);
        mockMatchedUsersService.getPlayers.mockResolvedValueOnce([ { id: 'user-1' }, { id: 'user-2' }]);
        
        matchDeclined(mockIo, mockSocket, 'pair-123', mockMatchedUsersService);

        expect(mockTo).toHaveBeenCalledWith('user-1');
        expect(mockEmit).toHaveBeenCalledWith('decline_done');
        expect(mockTo).toHaveBeenCalledWith('user-2');
        expect(mockEmit).toHaveBeenCalledWith('game_declined');
    });

    it('does nothing if no players found', () =>{
        mockMatchedUsersService.decline.mockReturnValueOnce(undefined);
        mockMatchedUsersService.getPlayers.mockResolvedValueOnce(null);

        matchDeclined(mockIo, mockSocket, 'pair-123', mockMatchedUsersService);

        expect(mockTo).not.toHaveBeenCalled();

    });
});

describe ('sendGameQuestions', () => {
    beforeEach(() => vi.clearAllMocks());

    it('emits get_questions to each player', () => {
        mockGameStore.get.mockReturnValueOnce({
            players: [{ id: 'user-1' }, { id: 'user-2' }],
            questions: ['q1', 'q2']
        });

        sendGameQuestions(mockIo, 42, mockGameStore);

        expect(mockGameStore.get).toHaveBeenCalledWith(42);
        expect(mockTo).toHaveBeenCalledWith('user-1');
        expect(mockTo).toHaveBeenCalledWith('user-2');
        expect(mockEmit).toHaveBeenCalledWith('get_questions', ['q1','q2']);
    });

    it('does not emit if game data is null', () => {
        mockGameStore.get.mockReturnValueOnce(null);

        sendGameQuestions(mockIo, 42, mockGameStore);

        expect(mockTo).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });
});

describe('sendGamePlayers', () => {
    beforeEach(() => vi.clearAllMocks());

    it('emits get_players to each player', () => {
        const players = [{ id: 'user-1' }, { id: 'user-2' }];
        mockGameStore.get.mockReturnValueOnce({ players, questions: [] });

        sendGamePlayers(mockIo, 42, mockGameStore);

        expect(mockGameStore.get).toHaveBeenNthCalledWith(42);
        expect(mockTo).toHaveBeenCalledWith('user-1');
        expect(mockTo).toHaveBeenCalledWith('user-2');
        expect(mockEmit).toHaveBeenCalledWith('get_players', players);
    });

    it('does not emit if game data is null', () => {
        mockGameStore.get.mockReturnValueOnce(null);

        sendGamePlayers(mockIo, 42, mockGameStore);

        expect(mockTo).not.toHaveBeenCalled();
        expect(mockEmit).not.toHaveBeenCalled();
    });
});

