import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";

export interface IShopItemRepository {
    getAllItems(): Promise<ShopItemDTO[]>;
    getItemById(shop_item_id: string): Promise<ShopItemDTO | null>;
}