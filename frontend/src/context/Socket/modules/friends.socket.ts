import type { Socket } from "socket.io-client";
import { emit, on } from "../dispatch";
import type {
    FriendRequestPing, FriendResponsePing,
    PlayInvitePayload, SendPlayInviteDTO, PlayInviteResponseDTO
} from "src/dtos/friends/friend.dto";

export class FriendsSocket {
    private readonly socket: Socket;

    constructor(socket: Socket) {
        this.socket = socket;
    }

    /**************************** LISTENERS *********************/
    friendRequestReceived(handler:(data:  FriendRequestPing) => void) {
        return on<FriendRequestPing>(this.socket, 'friend_request_received', handler);
    }

    friendRequestResponded(handler: (data: FriendResponsePing) => void) {
        return on<FriendResponsePing>(this.socket, 'friend_request_responded', handler);
    }

    playInviteReceived(handler: (data: PlayInvitePayload) => void) {
        return on<PlayInvitePayload>(this.socket, 'play_invite_received', handler);
    }

    playInviteResponded(handler: (data: PlayInviteResponseDTO) => void) {
        return on<PlayInviteResponseDTO>(this.socket, 'play_invite_responded', handler);
    }

    /**************************** EMITTERS **********************/

    sendFriendRequest(data: {receiver_id: string; from_username: string }) {
        return emit<typeof data, void>(this.socket, 'friend_request_sent', data);
    }

    respondFriendRequest(data: {requester_id: string; status: 'accepted' | 'declined' }) {
        return emit<typeof data, void>(this.socket, 'friend_request_respond', data);
    }

    sendPlayInvite(data: SendPlayInviteDTO) {
        return emit<SendPlayInviteDTO, void>(this.socket, 'play_invite_sent', data);
    }

    respondPlayInvite(data: PlayInviteResponseDTO) {
        return emit<PlayInviteResponseDTO, void>(this.socket, 'play_invite_respond', data);
    }
}