import { FriendshipStatus } from "src/entities/db-entities/friendship.entities";

export interface FriendDTO {
    user_id: string;
    username: string;
    friendship_id: string;
    elo: number;
    avatar_id: number;
}

export interface FriendRequestDTO {
    friendship_id: string;
    user_id: string;
    username: string;
    status: FriendshipStatus;
    created_at: Date;
}

export interface FriendInviteDTO {
    invite_id: string;
    invite_code: string;
    expires_at: Date;
}