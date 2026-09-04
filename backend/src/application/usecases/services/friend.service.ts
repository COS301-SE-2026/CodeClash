import { IFriendRepository } from "src/application/interfaces/repositories/IFriendRepository";
import { FriendDTO, FriendRequestDTO, FriendInviteDTO } from "src/entities/dtos/friendship.dto";
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

    async removeFriend(friendship_id: string): Promise<void> {
        return this.friend_repo.removeFriend(friendship_id);
    }

    async createInvite(sender_id: string): Promise<FriendInviteDTO> {
        const invite_code = randomBytes(16).toString('hex');
        const expires_at = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour
        return this.friend_repo.createInvite(sender_id, invite_code, expires_at);
    
    }

    async acceptInvite(invite_code: string, receiver_id: string): Promise<void> {
        const invite = await this.friend_repo.getInviteByCode(invite_code);
        if(!invite) throw new Error('Invite not found');
        if (new Date() > invite.expires_at) throw new Error('Invite has expired');
        // TODO sender_id needs to come from invite. Might have to extend FriendInviteDTO
     }

     async getFriendCount(user_id: string): Promise<number> {
        return this.friend_repo.getFriendCount(user_id);
     }
}