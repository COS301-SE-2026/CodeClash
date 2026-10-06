import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { UsePowerupResultDTO } from "src/entities/dtos/shop/powerup-use.dto";
import { PowerupSystem } from "../../systems/powerup.system";
import { HttpError } from "src/entities/errors/http-error";

export class PowerupService {
    constructor (
        private readonly inventory_repo: IInventoryRepository,
        private readonly shop_item_repo: IShopItemRepository,
        private readonly powerup_system: PowerupSystem
    ) {}

    async usePowerup(user_id: string, match_id: number, shop_item_id: string, target_user_id?: string): Promise<UsePowerupResultDTO> {
        const item = await this.shop_item_repo.getItemById(shop_item_id);
        if (!item || item.category !== 'powerup') throw new HttpError(404, 'Item not found');

        if (this.powerup_system.isPowerdown(item.metadata.effect) && !target_user_id) {
            throw new HttpError(400, 'This effect requires a target player')
        }

        await this.inventory_repo.consumeItem(user_id,shop_item_id);

        const result = this.powerup_system.apply(
            match_id,
            item.metadata.effect,
            item.metadata,
            user_id,
            target_user_id
        );
        return {
            applied: !result.blocked,
            effect: item.metadata.effect,
            match_id,
            user_id,
            ...(target_user_id !== undefined && { target_user_id })
        };
    }
}