import { Repository } from "typeorm";
import { Friendship, FriendInvite } from "src/entities/db-entities/friendship.entities";
import { IFriendRepository } from "src/application/interfaces/repositories/IFriendRepository";
import { FriendDTO, FriendRequestDTO, FriendInviteDTO } from "../dtos/friendship.dto";

export class FriendRepository implements IFriendRepository {
    constructor (
        private readonly friendshipRepo: Repository<Friendship>,
        private readonly inviteRepo: Repository<FriendInvite>
    ){}

    async getFriends(user_id: string): Promise<FriendDTO[]> {
        
    }

    async getFriendRequests(user_id: string, type: "sent" | "received"): Promise<FriendRequestDTO[]> {
        
    }

    async sendFriendRequest(requester_id: string, receiver_id: string): Promise<void> {
        
    }

    async respondToRequest(friendship_id: string, status: "accepted" | "declined"): Promise<void> {
        
    }

    async removeFriend(friendship_id: string): Promise<void> {
        
    }

    async createInvite(sender_id: string, invite_code: string, expires_at: Date): Promise<FriendInviteDTO> {
        
    }

    async getInviteByCode(invite_code: string): Promise<FriendInviteDTO | null> {
        
    }

    async getFriendCount(user_id: string): Promise<number> {
        
    }
}