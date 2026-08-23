import { IFriendRepository } from "src/application/interfaces/repositories/IFriendRepository";
import { FriendDTO, FriendRequestDTO, FriendInviteDTO } from "src/interface-adapters/dtos/friendship.dto";
import { randomBytes } from "node:crypto";

export class FriendService {
    constructor(
        private readonly friend_repo: IFriendRepository
    ) {}

    async getFriends(user_id: string): Promise<FriendDTO[]> {
        return this.friend_repo.getFriends(user_id);
    }

    async getFriendRequests(user_id: string, type: 'sent' | 'received'): Promise<FriendRequestDTO[]> {
        return this.friend_repo.getFriendRequests(user_id, type);
    }

    async sendFriendRequests(requester_id: string, receiver_id: string): Promise<void> {
        if (requester_id === receiver_id) throw new Error('Cannot send friend request to yourself');

        return this.friend_repo.sendFriendRequest(requester_id, receiver_id);
    }

    async respondToRequest(friendship_id: string, status: 'accepted' | 'declined'): Promise<void> {
        return this.friend_repo.respondToRequest(friendship_id, status);
    }

    
}