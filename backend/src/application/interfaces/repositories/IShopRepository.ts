import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";
import { WalletDTO } from "src/entities/dtos/shop/wallet.dto";
import { TransactionDTO } from "src/entities/dtos/shop/transaction.dto";
import { UserItemDTO } from "src/entities/dtos/shop/user-item.dto";
import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";

export interface IShopRepository {
    getAllItems(): Promise<ShopItemDTO[]>;
    getItemById(shop_item_id: string): Promise<ShopItemDTO | null>;
    getUserItems(user_id: string): Promise<UserItemDTO[]>;
    hasItem(user_id: string, shop_item_id: string): Promise<boolean>;
    addUserItem(user_id: string, shop_item_id: string): Promise<UserItemDTO>;

    getWallet(user_id: string): Promise<WalletDTO | null>;
    createWallet(user_id: string): Promise<WalletDTO | null>;
    updateBalance(user_id: string, delta: number): Promise<WalletDTO>;

    // Having transactions would mean we want to keep records of each user's transactions. We currently don't have ways to display that

    getEquipped(user_id: string): Promise<EquippedItemsDTO | null>;
    updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO>;

    getUserPowerups(user_id: string): Promise<UserItemDTO[]>;
}