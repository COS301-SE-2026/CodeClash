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
        
    }catch (error) {
        io.to(`user:${socket.data.user_id}`).emit('powerup_error', (error as Error).message);
    }
};