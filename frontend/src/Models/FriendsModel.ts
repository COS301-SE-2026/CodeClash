export type FriendStatus = 'online' | 'offline' | 'playing';

export interface Friend {
    id: string;
    username: string;
    avatar: string;
    status: FriendStatus;
    elo: number; //they can see each others elo, like how you can see snapscore
}

export interface FriendRequest {
    id: string;
    username: string;
    avatar: string;
    sentAt: string; //A timestamp for when the request was sent, I see this on most apps
}

export interface Invite {
    id: string;
    fromId: string; //these are of the user who sends the invite
    fromUser: string;
    fromAvatar: string; 
    mode: 'casual'; //Friends system is for casual matches only, so that you cannot choose who to play Ranked with, its random matchmaking only
    expires: number; //This is to not leave the invite hanging forever if it doesnt get accepted
}