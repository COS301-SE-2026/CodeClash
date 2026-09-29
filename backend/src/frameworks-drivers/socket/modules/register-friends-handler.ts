import { Socket , Server} from "socket.io";
import { FriendDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { FriendInviteDTO } from "src/entities/dtos/friends/friendship.dto";
import { received_invite } from "src/interface-adapters/socket-handlers/friends-handlers";
import { sendFriendRequest } from "src/interface-adapters/controllers/friend.controllers";
import { __ServiceException } from "@aws-sdk/client-cognito-identity-provider/dist-types/models/CognitoIdentityProviderServiceException";

interface sendFriendRequestPayload { receiver_id: string; from_username: string }
interface RespondFriendRequestPayload { requester_id: string; status: 'accepted' | 'declined' }

interface PlayInvitePayload {
    id: string;
    mode: 'casual';
    participants: { name: string; elo: number; friendId?: string; avatar?: number; status?: string }[];
    expires: number;
}

interface SendPlayInvitePayload { receiver_id: string; invite: PlayInvitePayload }
interface RespondPlayInvitePayload { sender_id: string; invite_id: string; accepted: boolean }

export function registerFriendHandlers(io: Server, socket: Socket, _deps: FriendDeps) {
    registerHandler(socket,
        'friend_request_sent', async (s, payload: sendFriendRequestPayload) => {
            io.to(`user:${payload.receiver_id}`).emit('friend_request_received', {
                from_user_id: s.data.user_id,
                from_username: payload.from_username,
            });
        });

    registerHandler(socket,
        'friend_request_respond', async (s, payload: RespondFriendRequestPayload) => {
            io.to(`user:${payload.requester_id}`).emit('friend_request_responded', {
                from_user_id: s.data.user_id,
                from_userame: s.data.username,
                status: payload.status,
            });
        });

    registerHandler(socket, 'play_invite_sent', async (_s, payload: SendPlayInvitePayload) => {
        io.to(`user:${payload.receiver_id}`).emit('play_invite_received', payload.invite);
    });

    registerHandler(socket, 'play_invite_respond', async (_s, payload: RespondPlayInvitePayload) => {
        io.to(`user:${payload.sender_id}`).emit('play_invite_responded', payload);
    });
}