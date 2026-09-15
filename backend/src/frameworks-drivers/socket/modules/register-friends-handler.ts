import { Socket } from "socket.io";
import { Server } from "socket.io";
import { FriendDeps } from "../dependencies";
import { registerHandler } from "../dispatch";
import { FriendInviteDTO } from "src/entities/dtos/friends/friendship.dto";
import { received_invite } from "src/interface-adapters/socket-handlers/friends-handlers";

export function registerFriendHandlers(io: Server, socket: Socket, deps: FriendDeps) {
    registerHandler(socket,
        'send_friend_invite',
        async (socket, data: FriendInviteDTO) => received_invite(io, data)
    );

}