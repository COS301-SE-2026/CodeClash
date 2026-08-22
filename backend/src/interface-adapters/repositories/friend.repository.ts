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
        const friendships = await this.friendshipRepo.find({
            where: [
                { requester: { user_id }, status: 'accepted' },
                { receiver: { user_id }, status: 'accepted'}
            ],
            relations: { requester: true, receiver: true }
        });

        return friendships.map(f => {
            const friend = f.requester.user_id === user_id ? f.receiver : f.requester;
            return {
                user_id: friend.user_id,
                username: friend.username,
                friendship_id: f.friendship_id
            };
        });
    }

    async getFriendRequests(user_id: string, type: "sent" | "received"): Promise<FriendRequestDTO[]> {
        const where = type === 'sent'
        ? { requester: { user_id }, status: 'pending' as const }
        : { receiver: { user_id }, status: 'pending' as const };

        const friendships = await this. friendshipRepo.find({
            where,
            relations: { requester: true, receiver: true }
        });

        return friendships.map(f => {
            const other = type === 'sent' ? f.receiver : f.requester;
            return {
                friendship_id: f.friendship_id,
                user_id: other.user_id,
                username: other.username,
                status: f.status,
                created_at: f.created_at
            };
        });
    }

    async sendFriendRequest(requester_id: string, receiver_id: string): Promise<void> {
        const existing = await this.friendshipRepo.findOne({
            where: [
                { requester: { user_id: requester_id }, receiver: { user_id: receiver_id }},
                { requester: { user_id: receiver_id }, receiver: { user_id: requester_id }}
            ]
        });

        if (existing) throw new Error('Friend request already exists');

        await this.friendshipRepo.save(this.friendshipRepo.create({
            requester: { user_id: requester_id } as any,
            receiver: { user_id: receiver_id } as any,
            statis: 'pending'
        }));
    }

    async respondToRequest(friendship_id: string, status: "accepted" | "declined"): Promise<void> {
        await this.friendshipRepo.update({ friendship_id }, { status, updated_at: new Date() });

    }

    async removeFriend(friendship_id: string): Promise<void> {
        await this.friendshipRepo.delete({ friendship_id });
    }

    async createInvite(sender_id: string, invite_code: string, expires_at: Date): Promise<FriendInviteDTO> {
        const invite = await this.inviteRepo.save(this.inviteRepo.create({
            sender: { user_id: sender_id } as any,
            invite_code,
            expires_at
        }));
        return{
            invite_id: invite.invite_id,
            invite_code: invite.invite_code,
            expires_at: invite.expires_at
        };
    }

    async getInviteByCode(invite_code: string): Promise<FriendInviteDTO | null> {
        const invite = await this.inviteRepo.findOne({ where: {invite_code } });
        if(!invite) return null;
        return {
            invite_id: invite.invite_id,
            invite_code: invite.invite_code,
            expires_at: invite.expires_at
        };
    }

    async getFriendCount(user_id: string): Promise<number> {
        return this.friendshipRepo.count({
            where: [
                { requester: { user_id }, status: 'accepted' },
                { receiver: { user_id }, status: 'accepted' }
            ]
        });
    }
}