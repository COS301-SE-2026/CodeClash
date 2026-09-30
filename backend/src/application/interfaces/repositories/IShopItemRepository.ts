import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";
import { ShopItem } from "src/entities/database/shop-item.entities";

export interface IShopItemRepository {
    getAllItems(): Promise<ShopItemDTO[]>;
    getItemById(shop_item_id: string): Promise<ShopItemDTO | null>;
    getDefaultTheme(): Promise<ShopItemDTO>;
    getDefaultAvatar(): Promise<ShopItemDTO>,
    toDTO(item: ShopItem): ShopItemDTO
}