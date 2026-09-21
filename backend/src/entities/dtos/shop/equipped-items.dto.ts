import { ShopItemDTO } from './shop.dto';

export interface EquippedItemsDTO {
    user_id: string;
    avatar: ShopItemDTO | null;
    top: ShopItemDTO | null;
    bottom: ShopItemDTO | null;
    one_piece: ShopItemDTO | null;
    shoes: ShopItemDTO | null;
    hat: ShopItemDTO | null;
    powerup: ShopItemDTO | null;
    updated_at: Date;
}

export interface UpdatedEquippedDTO {
    avatar_item_id?: string;
    top_id?: string;
    bottom_id?: string;
    one_piece_id?: string;
    shoes_id?: string;
    hat_id?: string;
    powerup_item_id?: string; 
}