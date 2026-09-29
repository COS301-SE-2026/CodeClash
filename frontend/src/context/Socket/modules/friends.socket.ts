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
}