import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { UserItemDTO } from "src/entities/dtos/shop/user-item.dto";

export class InventoryService {
    constructor(private readonly inventory_repo: IInventoryRepository) {}

    async getUserItems(user_id: string): Promise<UserItemDTO[]> {
        return this.inventory_repo.getUserItems(user_id);
    }

    async getUserPowerups(user_id: string): Promise<UserItemDTO[]> {
        return this.inventory_repo.getUserPowerups(user_id);
    }
}