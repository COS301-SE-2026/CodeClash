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
        const item = await this. shop_repo.getItemById(shop_item_id);
        if (!item) throw new Error('Item not found');

        const alreadyOwned = await this.shop_repo.hasItem(user_id, shop_item_id);
        if(alreadyOwned) throw new Error('Item already owned');

        return this.shop_repo.purchaseItemTransaction(user_id, shop_item_id, item.price);
    }

    async getWallet(user_id: string) : Promise<WalletDTO> {
        let wallet = await this.shop_repo.getWallet(user_id);
        if (!wallet) wallet = await this.shop_repo.createWallet(user_id);
        return wallet;
    }

    async earnCurrency(user_id: string, amount: number): Promise<WalletDTO> {
        const existing = await this.shop_repo.getWallet(user_id);
        if (!existing) await this.shop_repo.createWallet(user_id);
        return this.shop_repo.updateBalance(user_id, amount);
    }

    async getEquipped(user_id: string): Promise<EquippedItemsDTO> {
        const equipped = await this.shop_repo.getEquipped(user_id);
        if (equipped) return equipped;
        return this.shop_repo.updateEquipped(user_id, {});
    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {
        for (const [, item_id] of Object.entries(updates)) {
            if(!item_id) continue;
            const owned = await this.shop_repo.hasItem(user_id, item_id);
            if (!owned) throw new Error('Item not owned');
        }
        return this.shop_repo.updateEquipped(user_id, updates);
    }

    async getUserPowerups(user_id: string): Promise<UserItemDTO[]> {
        return this.shop_repo.getUserPowerups(user_id);
    }

    async usePowerup(user_id: string, match_id: string, shop_item_id: string, target_user_id?: string): Promise<UsePowerupResultDTO> {
        const owned = await this.shop_repo.hasItem(user_id,shop_item_id);
        if (!owned) throw new Error('Powerup not owned');

        const item = await this.shop_repo.getItemById(shop_item_id);
        if (!item || item.category !== 'powerup') throw new Error('Item not found');

        const effect = (item.metadata as { effect: string }).effect;

        // hook point to apply effect to ECS via powerup system

        return {
            applied: true,
            effect,
            match_id,
            user_id,
            ...(target_user_id !== undefined && { target_user_id })
        };

    }


}