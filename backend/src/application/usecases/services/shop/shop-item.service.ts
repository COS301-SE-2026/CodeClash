import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository"; 
import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";

export class ShopItemService {
    constructor (
        private readonly shop_item_repo: IShopItemRepository
    ) {}

    async getAllItems(): Promise<ShopItemDTO[]> {
        return this.shop_item_repo.getAllItems();
    }

}