import { Repository } from "typeorm";
import { ShopItem } from "src/entities/db-entities/shop-item.entities";
import { Wallet } from "src/entities/db-entities/wallet.entities";
import { UserItem } from "src/entities/db-entities/user-item.entities";
import { EquippedItems } from "src/entities/db-entities/equipped-items.entities";
import { IShopRepository } from "src/application/interfaces/repositories/IShopRepository";
import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";
import { WalletDTO } from "src/entities/dtos/shop/wallet.dto";
import { UserItemDTO } from "src/entities/dtos/shop/user-item.dto";
import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";

export class ShopRepository implements IShopRepository {
    constructor(
        private readonly shopItemRepo: Repository<ShopItem>,
        private readonly walletRepo: Repository<Wallet>,
        private readonly userItemRepo: Repository<UserItem>,
        private readonly equippedRepo: Repository<EquippedItems>
    ) {}

    private toItemDTO(item: ShopItem): ShopItemDTO {
        return {

        } as ShopItemDTO;
    }

    private toWalletDTO(wallet: Wallet): WalletDTO {
        return {

        };
    }

    private toEquippedDTO(equipped: EquippedItems): EquippedItemsDTO {
        return {

        };
    }

    async getAllItems(): Promise<ShopItemDTO[]> {
        
    }

    async getItemById(shop_item_id: string): Promise<ShopItemDTO | null> {
        
    }

    async getUserItems(user_id: string): Promise<UserItemDTO[]> {
        
    }

    async hasItem(user_id: string, shop_item_id: string): Promise<boolean> {
        
    }

    async addUserItem(user_id: string, shop_item_id: string): Promise<UserItemDTO> {
        
    }

    async getWallet(user_id: string): Promise<WalletDTO | null> {
        
    }

    async createWallet(user_id: string): Promise<WalletDTO | null> {
        
    }

    async updateBalance(user_id: string, delta: number): Promise<WalletDTO> {
        
    }

    async getEquipped(user_id: string): Promise<EquippedItemsDTO | null> {
        
    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {
        
    }

    async getUserPowerups(user_id: string): Promise<UserItemDTO[]> {
        
    }
}