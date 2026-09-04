import { FriendDTO, FriendRequestDTO, FriendInviteDTO } from "src/interface-adapters/dtos/friendship.dto";

export interface IFriendRepository {
    getFriends(user_id: string): Promise<FriendDTO[]>;
    getFriendRequests(user_id: string, type: 'sent' | 'received'): Promise<FriendRequestDTO[]>;
    sendFriendRequest(requester_id: string, receiver_id: string): Promise<void>;
    respondToRequest(friendship_id: string, status: 'accepted' | 'declined'): Promise<void>;
    removeFriend(friendship_id: string): Promise<void>;
    createInvite(sender_id: string, invite_code: string, expires_at: Date): Promise<FriendInviteDTO>;
    getInviteByCode(invite_code: string): Promise<FriendInviteDTO | null>;
    getFriendCount(user_id: string): Promise<number>;    
}