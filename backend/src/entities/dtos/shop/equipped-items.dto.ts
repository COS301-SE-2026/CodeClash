import { ShopItemDTO } from './shop.dto';

export interface EquippedItemsDTO {
    user_id: string;
    avatar: ShopItemDTO | null;
    powerup: ShopItemDTO | null;
    theme: ShopItemDTO;
    updated_at: Date;
}

export interface UpdatedEquippedDTO {
    avatar_item_id?: string;
    powerup_item_id?: string; 
    theme_id?: string;
}