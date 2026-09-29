export interface FriendRequestPing {
    from_user_id: string;
    from_username: string;
}

export interface FriendResponsePing {
    from_user_id: string;
    from_username: string;
    status: 'accepted' | 'declined';
}

export interface PlayInvitePayload {
    id: string;
    mode: 'casual';
    participants: {
        name: string;
        elo: number;
        friendId?: string;
        avatar?: number;
        status?: 'online' | 'offline' | 'playing';
    }[];
    expires: number;
}