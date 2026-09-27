import { Server, Socket } from "socket.io";
import { PowerupService } from "src/application/usecases/services/shop/powerup.service";

export interface UsePowerupPayload {
    match_id: number;
    shop_item_id: string;
    target_user_id?: string;
}

export const usePowerup = async (
    io: Server,
    socket: Socket,
    data: UsePowerupPayload,
    powerup_service: PowerupService
) => {
    try {
        const result = await powerup_service.usePowerup(
            socket.data.user_id,
            data.match_id,
            data.shop_item_id,
            data.target_user_id
        );

        io.to(`user:${socket.data.user_id}`).emit('powerup_used', result);

        if (!data.target_user_id) return;

        if (!result.applied){
            io.to(`user:${data.target_user_id}`).emit('powerup_blocked', result);
            return;
        }

        if (result.effect === 'wipe_answer'){
            io.to(`user:${data.target_user_id}`).emit('clear_input');
        } else if (result.effect === 'insert_bugs') {
            io.to(`user:${data.target_user_id}`).emit('corrupt_input');
        } else {
            io.to(`user:${data.target_user_id}`).emit('powerup_received', result);
        }
    }catch (error) {
        io.to(`user:${socket.data.user_id}`).emit('powerup_error', (error as Error).message);
    }
};