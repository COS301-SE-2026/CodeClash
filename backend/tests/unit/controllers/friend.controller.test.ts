import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFriends, getFriendRequests, sendFriendRequest, respondToFriendRequest, removeFriend, createInvite } from '../../../src/interface-adapters/controllers/friend.controllers';
import { FriendService } from '../../../src/application/usecases/services/friend.service';
import { execPath } from 'node:process';

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
            req.user = undefined;

            const handler = getFriendRequests(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(mockService.getFriendRequests).not.toHaveBeenCalled();
        });

        it('returns 500 if service throws', async () => {
            // copied from above
            mockService.getFriendsRequests.mockRejectedValueOnce(new Error('DB error'));

            const handler = getFriendRequests(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
        });
    });

    describe('sendFriendRequest', async () => {
        it('returns 201 on successful request', async () => {
            mockService.sendFriendRequest.mockResolvedValueOnce(undefined);
            req.body = { receiver_id: 'user-2' };

            const handler = sendFriendRequest(mockService);
            await handler(req, res);

            expect(mockService.sendFriendRequest).toHaveBeenCalledWith('user-1', 'user-2');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: 'Friend request sent' });
        });

        it('returns 400 if receiver_id is missing', async () => {
            req.body = {};

            const handler = sendFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'receiver_id is required' });
            expect(mockService.sendFriendRequest).not.toHaveBeenCalledWith();
        });

        it('returns 401 if user is not authenticated', async () => {
            req.user = undefined;
            res.body = { receiver_id: 'user-2' };

            const handler = sendFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(mockService.sendFriendRequest).not.toHaveBeenCalled();
        });

        it('returns 409 if request already exists', async () => {
            mockService.sendFriendRequest.mockRejectedValueOnce(new Error('Friend request already exists' ));
            req.body = { receiver_id: 'user-2' };

            const handler = sendFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ message: 'Friend request already exists' });
        });

        it('returns 500 on unexpected error', async () => {
            // copied from above
            mockService.sendFriendsRequest.mockRejectedValueOnce(new Error('DB error'));
            req.body = { receiver_id: 'user-2' };

            const handler = sendFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('respondToFriendRequest', () => {
        it('returns 200 on accepted', async () => {
            mockService.respondToRequest.mockResolvedValueOnce(undefined);
            req.params = { friendship_id: 'f-1' };
            req.body = { status: 'accepted' };

            const handler = respondToFriendRequest(mockService);
            await handler(req, res);

            expect(mockService.respondToRequest).toHaveBeenCalledWith('f-1', 'accepted');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Friend request accepted' });
        });

        it('returns 200 on declined', async () => {
            mockService.respondToRequest.mockResolvedValueOnce(undefined);
            req.params = { friendship_id: 'f-1' };
            req.body = { status: 'declined' };

            const handler = respondToFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Friend request declined' });
        });

        it('returns 400 if status is invalid', async () => {
            req.params = { friendship_id: 'f-1' };
            req.body = { status: 'blocked' };

            const handler = respondToFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'status must be accpeted or declined' });
            expect(mockService.respondToRequest).not.toHaveBeenCalled();
        });

        it('returns 400 if friendship_id is missing', async () => {
            req.params = {};
            req.body = { status: 'accepted' };

            const handler = respondToFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(mockService.respondToRequest).not.toHaveBeenCalled();
        });

        it('returns 500 if service throws', async () => {
            // copied from above
            mockService.sendFriendsRequest.mockRejectedValueOnce(new Error('DB error'));
            req.pramas = { friendship_id: 'f-1' };
            req.body = { status: 'accepted' };

            const handler = sendFriendRequest(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    });

    describe('removeFriend', () => {
        it('return 200 on successful removal', async () => {
            mockService.removeFriend.mockResolvedValueOnce(undefined);
            req.params = { friendship_id: 'f-1' };

            const handler = removeFriend(mockService);
            await handler(req, res);

            expect(mockService.removeFriend).toHaveBeenCalledWith('f-1');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'Friend removed'});
        });

        it('returns 400 if friendship_id is missing', async () => {
            req.params = {};

            const handler = removeFriend(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(mockService.removeFriend).not.toHaveBeenCalled();
        });

        it('returns 500 if service throws', async () => {
             // copied from above
            mockService.removeFriend.mockRejectedValueOnce(new Error('DB error'));
            req.pramas = { friendship_id: 'f-1' };

            const handler = removeFriend(mockService);
            await handler(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
        });
    }); //end removeFriend

    describe('createInvite', () => {
        it('returns 201 with invite details', async () => {
            const mockInvite = {
                invite_id: 'inv-1',
                invite_code: 'abc123',
                expires_at: new Date()
            };
            mockService.createInvite.mockResolvedValueOnce(mockInvite);

            const handler = createInvite(mockService);
            await handler(req, res);

            expect(mockService.createInvite).toHaveBeenCalledWith('user-1');
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockInvite);
        });

        it('returns 401 if user is not authenticated', async () => {

        });

        it('returns 500 if service throws', async () => {

        });
    });// end createInvite
});