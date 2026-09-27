import { Server, Socket } from "socket.io";
import { PowerupService } from "src/application/usecases/services/shop/powerup.service";

export interface UsePowerupPayload {
    match_id: number;
    shop_item_id: string;
    target_user_id?: string;
}

