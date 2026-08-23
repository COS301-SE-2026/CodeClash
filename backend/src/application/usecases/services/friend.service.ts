import { IFriendRepository } from "src/application/interfaces/repositories/IFriendRepository";
import { FriendDTO, FriendRequestDTO, FriendInviteDTO } from "src/interface-adapters/dtos/friendship.dto";
import { randomBytes } from "node:crypto";

export class FriendService {
    constructor(
        private readonly friend_repo: IFriendRepository
    ) {}

    async getFriends(user_id: string): Promise<FriendDTO[]> {

    }

    async getFriendRequests(user_id: string, type: 'sent' | 'received'): Promise<FriendRequestDTO[]> {

    }

    async sendFriendRequests(requester_id: string, receiver_id: string): Promise<void> {

    }

    async respondToRequest(friendship_id: string, status: 'accepted' | 'declined'): Promise<void> {
        
    }
}