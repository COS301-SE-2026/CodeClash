import { IEquippedRepository } from "src/application/interfaces/repositories/IEquippedRepository";
import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";
import { HttpError } from "src/entities/errors/http-error";

export class EquipmentService {
    constructor(
        private readonly equipped_repo: IEquippedRepository,
        private readonly inventory_repo: IInventoryRepository,
        private readonly shop_item_repo: IShopItemRepository
    ) {}

    async getEquipped(user_id: string): Promise<EquippedItemsDTO> {
        const equipped = await this.equipped_repo.getEquipped(user_id);
        const needs_theme = !equipped?.theme;
        const needs_avatar = !equipped?.avatar;

        if (!equipped || needs_avatar || needs_theme){
            const updates: UpdatedEquippedDTO = {};

            if(needs_theme){
                const default_theme = await this.shop_item_repo.getDefaultTheme();
                updates.theme_id = default_theme.shop_item_id;
                await this.inventory_repo.grantItem(user_id, default_theme.shop_item_id);
            }
            if(needs_avatar){
                const default_avatar = await this.shop_item_repo.getDefaultAvatar();
                updates.avatar_item_id = default_avatar.shop_item_id;
                await this.inventory_repo.grantItem(user_id, default_avatar.shop_item_id)
            }
            return this.equipped_repo.updateEquipped(user_id, updates);
        } 
            return equipped;

    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {
        for (const [, item_id] of Object.entries(updates)) {
            if(!item_id) continue;
            const owned = await this.inventory_repo.hasItem(user_id, item_id);
            if (!owned) throw new HttpError(403, 'Item not owned');
        }
        return this.equipped_repo.updateEquipped(user_id, updates);
    }
}