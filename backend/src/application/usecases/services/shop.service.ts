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

    async purchaseItem(user_id: string, shop_item_id: string): Promise< PurchaseResultDTO> {

    }

    async getWallet(user_id: string) : Promise<WalletDTO> {

    }

    async earnCurrency(user_id: string, amount: number): Promise<WallerDTO> {

    }

    async getEquipped(user_id: string): Promise<EquippedItemsDTO> {

    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {

    }

    async getUserPowerups(user_id: string): Promise<UserItemDTO[]> {

    }

    async usePowerup(user_id: string, match_id: number, shop_item_id: string, target_user_id?: string): Promise<UsePowerupResultDTO> {

    }

    
}