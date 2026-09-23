import { ShopItemDTO } from './shop.dto';

export interface UserItemDTO {
    user_item_id: string;
    user_id: string;
    item: ShopItemDTO;
    acquired_at: Date;
}