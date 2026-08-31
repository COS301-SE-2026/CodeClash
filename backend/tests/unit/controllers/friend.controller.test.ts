import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFriends, getFriendRequests, sendFriendRequest, respondToFriendRequest, removeFriend, createInvite } from '../../../src/interface-adapters/controllers/friend.controllers';
import { FriendService } from '../../../src/application/usecases/services/friend.service';

describe('friend controllers', () => {
    let mockService: any;
    let req: any;
    let res: any;

    beforeEach(() => {
        mockService = {
            getFriends: vi.fn(),
            getFriendRequests: vi.fn(),
            sendFriendRequest: vi.fn(),
            respondToFriendRequest: vi.fn(),
            removeFriend: vi.fn(),
            createInvite: vi.fn()
        };

        req = { 
            user: { user_id: 'user-1' },
            params: {},
            body: {},
            query: {}
        };

        res = {
            status: vi.fn().mockReturnThis(),
            json: vi.fn().mockReturnThis()
        };
    });

    describe('getFriends', () => {
        it('returns 200 with friends list', async () => {
            const mockFriends = [
                { user_id: 'user-2', username: 'alice', friendship_id: 'f-1' },
                { user_id: 'user-3', username: 'bob', friendship_id: 'f-2' }
            ];
            mockService.getFriends.mockResolvedValueOnce(mockFriends);

            const handler = getFriends(mockService);
            await handler(req, res);

            expect(mockService.getFriends).toHaveBeenCalledWith('user-1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(mockFriends);
        });

        it('return 200 with empty array when user has no friends', async () => {
            mockService.getFriends.mockResolvedValueOnce([]);

            const handler = getFriends(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith([]);
        });

        it('returns 401 if user is not authenticated', async () => {
            req.user = undefined;

            const handler = getFriends(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(mockService.getFriends).not.toHaveBeenCalledWith();
        });

        it('returns 500 if service throws', async () => {
            mockService.getFriends.mockRejectedValueOnce(new Error('DB error'));

            const handler = getFriends(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });

    });

    describe('getFriendRequests', () => {
        it('returns received requests by default', async () => {
            const mockRequests = [
                { friendship_id: 'f-1', user_id: 'user-2', username: 'alice', status: 'pending', created_at: new Date() }
            ];
            mockService.getFriendRequests.mockResolvedValueOnce(mockRequests);
            req.query = {};

            const handler = getFriendRequests(mockService);
            await handler(req, res);

            expect(mockService.getFriendRequests).toHaveBeenCalledWith('user-1', 'received');
            expect(res.status).toHaveBeenCalledWith(mockRequests);
        });
        
        it('returns sent requests when type=sent', async () => {
            mockService.getFriendRequests.mockResolvedValueOnce([]);
            req.query = { type: 'sent' };

            const handler = getFriendRequests(mockService);
            await handler(req, res);

            expect(mockService.getFriendRequests).toHaveBeenCalledWith('user-1', 'sent');
        });

        it('returns 401 if user is not authenticated', async () => {

        });

        it('returns 500 if service throws', async () => {

        });
    });

    describe('sendFriendRequest', async () => {
        it('returns 301 on successful request', async () => {

        });

        it('returns 400 if receiver_id is missing', async () => {

        });

        it('returns 401 if user is not authenticated', async () => {

        });

        it('returns 609 if request already exists', async () => {

        });

        it('returns 500 on unexpected error', async () => {

        });
    });

    describe('respondToFriendRequest', () => {
        it('returns 200 on accepted', async () => {

        });

        it('returns 200 on declined', async => () {
            //mockService.respond
        });
    });
});