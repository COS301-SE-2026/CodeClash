import { IShopRepository } from "src/application/interfaces/repositories/IShopRepository";
import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";
import { WalletDTO } from "src/entities/dtos/shop/wallet.dto";
import { UserItemDTO } from "src/entities/dtos/shop/user-item.dto";
import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";
import { PurchaseResultDTO } from "src/entities/dtos/shop/purchase-result.dto";
import { UsePowerupResultDTO } from "src/entities/dtos/shop/powerup-use.dto";

export class ShopService {
    constructor (
        private readonly shop_repo: IShopRepository
    ) {}

    async getAllItems(): Promise<ShopItemDTO[]> {
        return this.shop_repo.getAllItems();
    }

    async getUserItems(user_id: string): Promise<UserItemDTO[]> {
        return this.shop_repo.getUserItems(user_id);
    }

    
}