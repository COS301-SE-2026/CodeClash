import { ShopItemDTO } from './shop.dto';

export interface EquippedItemsDTO {
    user_id: string;
    avatar: ShopItemDTO | null;
    headwear: ShopItemDTO | null;
    neckwear: ShopItemDTO | null;
    facewear: ShopItemDTO | null;
    belt: ShopItemDTO | null;
    one_piece: ShopItemDTO | null;
    powerup: ShopItemDTO | null;
    theme: ShopItemDTO;
    updated_at: Date;
}

export interface UpdatedEquippedDTO {
    avatar_item_id?: string;
    headwear_id?: string;
    neckwear_id?: string;
    facewear_id?: string;
    belt_id?: string;
    one_piece_id?: string;
    powerup_item_id?: string; 
    theme_id?: string;
}