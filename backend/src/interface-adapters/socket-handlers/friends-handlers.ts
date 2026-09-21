import { Server } from "socket.io";
import { FriendInviteDTO } from "src/entities/dtos/friends/friendship.dto";

export const received_invite = (io: Server, data: FriendInviteDTO) => {
    io.to(data.receiver_id!).emit('friend_invite_received', {
        invite_id: data.invite_code,
        sender_name: data.sender_name,
        expires_at: data.expires_at
    });
}