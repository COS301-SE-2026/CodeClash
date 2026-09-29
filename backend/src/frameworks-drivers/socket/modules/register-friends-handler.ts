import { Socket , Server} from "socket.io";
import { FriendDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { FriendInviteDTO } from "src/entities/dtos/friends/friendship.dto";
import { received_invite } from "src/interface-adapters/socket-handlers/friends-handlers";
import { sendFriendRequest } from "src/interface-adapters/controllers/friend.controllers";

interface sendFriendRequestPayload { receiver_id: string; from_username: string }
interface respondFriendRequestPayload { requester_id: string; status: 'accepted' | 'declined' }

interface PlayInvitePayload {
    id: string;
    mode: 'casual';
    participants: { name: string; elo: number; friendId?: string; avatar?: number; status?: string }[];
    expires: number;
}

interface SendPlayInvitePayload { receiver_id: string; invite: PlayInvitePayload }
interface respondPlayInvite { sender_id: string; invite_id: string; accepted: boolean }

export function registerFriendHandlers(io: Server, socket: Socket, _deps: FriendDeps) {
    registerHandler(socket,
        'friend_request_sent', async (s, payload: sendFriendRequestPayload) => {
            io.to(`user:${payload.receiver_id}`).emit('friend_request_received', {
                from_user_id: s.data.user_id,
                from_username: payload.from_username,
            });
        });

    
}