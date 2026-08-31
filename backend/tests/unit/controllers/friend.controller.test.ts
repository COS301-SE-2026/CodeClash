import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFriends, getFriendRequests, sendFriendRequest, respondToFriendRequest, removeFriend, createInvite } from '../../../src/interface-adapters/controllers/friend.controllers';
import { FriendService } from '../../../src/application/usecases/services/friend.service';
import { AnyARecord } from 'node:dns';
import { remove } from 'aws-amplify/storage';

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

        });

        it('return 200 with empty array when user has no friends', async () => {

        });

        it('returns 401 if user is not authenticated', async () => {

        });

        it('returns 500 if service throws', async () => {

        });

    });

    describe('getFriendRequests', () => {
        it('returns received requests by default', async () => {

        });
        
        it('returns sent requests when type=sent', async () => {

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
            mockService.respond
        });
    });
});