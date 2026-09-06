import { Repository } from "typeorm";
import { Friendship, FriendInvite } from "src/entities/db-entities/friendship.entities";
import { IFriendRepository } from "src/application/interfaces/repositories/IFriendRepository";
import { FriendDTO, FriendRequestDTO, FriendInviteDTO } from "src/entities/dtos/friendship.dto";
import { EloRatings } from "src/entities/db-entities/elo.entities";
import { IEloRepository } from "src/application/interfaces/repositories/IEloRepository";

export class FriendRepository implements IFriendRepository {
    constructor (
        private readonly friendshipRepo: Repository<Friendship>,
        private readonly inviteRepo: Repository<FriendInvite>,
        private readonly elo_repo: IEloRepository
    ){}

    async getFriends(user_id: string): Promise<FriendDTO[]> {
        const friendships = await this.friendshipRepo.find({
            where: [
                { requester: { user_id }, status: 'accepted' },
                { receiver: { user_id }, status: 'accepted'}
            ],
            relations: { requester: true, receiver: true }
        });

        // fetch friends user_ids to get their elos
        const friendUsers = friendships.map(f => f.requester.user_id === user_id ? f.receiver : f.requester );

        // fetch friend's elo ratings
        const eloMap = new Map<string, number>();
        for (const friend of friendUsers) {
            const elo = await this.elo_repo.getElo(friend.user_id)
            eloMap.set(friend.user_id, elo?.rating ?? 600);
        }

        return friendships.map(f => {
            const friend = f.requester.user_id === user_id ? f.receiver : f.requester;
            return {
                user_id: friend.user_id,
                username: friend.username,
                friendship_id: f.friendship_id,
                elo: eloMap.get(friend.user_id) ?? 600,
                avatar_id: friend.avatar_id
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

        if (existing) {
            // allow re-requesting if previously declined
            if (existing.status === 'declined') {
                // rate limit to only be able to send again after 24 hours
                const hoursSince = (Date.now() - existing.updated_at.getTime()) / (1000 * 60 * 60);
                if( hoursSince < 24) throw new Error('Please wait 24 hours before sending another request');

                // reset to pending
                await this.friendshipRepo.update(
                    { friendship_id: existing.friendship_id },
                    { 
                        requester: { user_id: requester_id } as any,
                        receiver: { user_id: receiver_id } as any,
                        status: 'pending', updated_at: new Date() }
                );
                return;
            }
            throw new Error('Friend request already exists');
        }

        await this.friendshipRepo.save(this.friendshipRepo.create({
            requester: { user_id: requester_id } as any,
            receiver: { user_id: receiver_id } as any,
            status: 'pending'
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