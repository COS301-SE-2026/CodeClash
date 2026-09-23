import { IEquippedRepository } from "src/application/interfaces/repositories/IEquippedRepository";
import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";

export class EquipmentService {
    constructor(
        private readonly equipped_repo: IEquippedRepository,
        private readonly inventory_repo: IInventoryRepository
    ) {}

    async getEquipped(user_id: string): Promise<EquippedItemsDTO> {
        const equipped = await this.equipped_repo.getEquipped(user_id);
        if (equipped) return equipped;
        return this.equipped_repo.updateEquipped(user_id, {});
    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {
        for (const [, item_id] of Object.entries(updates)) {
            if(!item_id) continue;
            const owned = await this.inventory_repo.hasItem(user_id, item_id);
            if (!owned) throw new Error('Item not owned');
        }
        return this.equipped_repo.updateEquipped(user_id, updates);
    }
}