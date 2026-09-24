import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { UsePowerupResultDTO } from "src/entities/dtos/shop/powerup-use.dto";

export class PowerupService {
    constructor (
        private readonly inventory_repo: IInventoryRepository,
        private readonly shop_item_repo: IShopItemRepository
    ) {}

    async usePowerup(user_id: string, match_id: string, shop_item_id: string, target_user_id?: string): Promise<UsePowerupResultDTO> {
        const owned = await this.inventory_repo.hasItem(user_id,shop_item_id);
        if (!owned) throw new Error('Powerup not owned');

        const item = await this.shop_item_repo.getItemById(shop_item_id);
        if (!item || item.category !== 'powerup') throw new Error('Item not found');

        const effect = (item.metadata as { effect: string }).effect;

        // hook point to apply effect to ECS via powerup system

        return {
            applied: true,
            effect,
            match_id,
            user_id,
            ...(target_user_id !== undefined && { target_user_id })
        };
    }
}