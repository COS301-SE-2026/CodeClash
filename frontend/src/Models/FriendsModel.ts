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
    fromUser: string;
}

export type Relation = 'none' | 'friend' | 'pennding-sent' | 'pending-received' | 'self';

export interface Search {
    id: string;
    username: string;
    avatar: string;
    relationship: Relation;
}

// GET /api/friend/invite 
export interface GameInvite {
    invite_id: string;
    game_mode: 'casual'; //**The API has this as a free string, but friends can only play casual together
    friends: {
        name: string;
        elo: number;
    } [];
}

export interface Invite {
    id: string;
    mode: 'casual'; //Friends system is for casual matches only, so that you cannot choose who to play Ranked with, its random matchmaking only
    participants: {
        name: string;
        elo: number;
        friendId?: string;
        avatar?: string;
        status?: FriendStatus;
    }
    expires: number; //This is to not leave the invite hanging forever if it doesnt get accepted - **API needs to add support this, for now I will add a 10 minute client-side approx
}

export interface Summary {
    id: string;
    username: string;
    handle: string;
    avatar: string;
    league: string;
}

export interface FriendContent {
    title: string;
    subtitle: string;
    addFriend: string;

    requestsHeading: string;
    requestsEmpty: string;
    sendRequestLabel: string;
    requestSentLabel: string;

    friendsHeading: string;
    friendsEmpty: string;
    alreadyFriends: string; 

    respondLabel: string;
    acceptLabel: string;
    declineLabel: string;
    removeLabel: string;

    inviteTitle: string;
    inviteToPlay: string;
    inviteInvalid: string;
    inviteAcceptLabel: string;
    inviteDeclineLabel: string;

    searchPlaceholder: string;
    searchEmpty: string;
}

export const friendContent: FriendContent = {
    title: 'Friends',
    subtitle: 'Manage your friends, accept new requests, and play casual matches together.',
    addFriend: 'Add a new friend',

    requestsHeading: 'Friend Requests',
    requestsEmpty: 'No pending friend requests.',
    sendRequestLabel: 'Add Friend',
    requestSentLabel: 'Request Sent',

    friendsHeading: 'Friends',
    friendsEmpty: 'No friends yet.',
    alreadyFriends: 'Friends',

    respondLabel: 'Respond in requests',
    acceptLabel: 'Accept',
    declineLabel: 'Decline',
    removeLabel: 'Remove',

    inviteTitle: 'Match Invite',
    inviteToPlay: 'Invite to Play',
    inviteInvalid: 'Invite is not valid - your friend is already in a match',
    inviteAcceptLabel: 'Accept',
    inviteDeclineLabel: 'Decline',

    searchPlaceholder: 'Search by username',
    searchEmpty: 'No players found',
}