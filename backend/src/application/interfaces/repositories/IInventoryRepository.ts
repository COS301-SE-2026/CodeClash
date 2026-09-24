import { UserItemDTO } from "src/entities/dtos/shop/user-item.dto";

export interface IInventoryRepository {
    getUserItems(user_id: string): Promise<UserItemDTO[]>;
    hasItem(user_id: string, shop_item_id: string): Promise<boolean>;
    getUserPowerups(user_id: string): Promise<UserItemDTO[]>;
    
}