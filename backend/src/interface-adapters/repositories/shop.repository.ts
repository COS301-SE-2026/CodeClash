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
            shop_item_id: item.shop_item_id,
            category: item.category,
            name: item.name,
            description: item.description,
            price: item.price,
            rarity: item.rarity,
            metadata: item.metadata,
            created_at: item.created_at
        } as unknown as ShopItemDTO;
    }

    private toWalletDTO(wallet: Wallet): WalletDTO {
        return {
            wallet_id: wallet.wallet_id,
            user_id: wallet.user.user_id,
            balance: wallet.balance,
            updated_at: wallet.updated_at
        };
    }

    private toEquippedDTO(equipped: EquippedItems): EquippedItemsDTO {
        return {
            user_id: equipped.user.user_id,
            avatar: equipped.avatar? this.toItemDTO(equipped.avatar) : null,
            headwear: equipped.headwear? this.toItemDTO(equipped.headwear) : null,
            neckwear: equipped.neckwear? this.toItemDTO(equipped.neckwear) : null,
            facewear: equipped.facewear? this.toItemDTO(equipped.facewear) : null,
            one_piece: equipped.one_piece? this.toItemDTO(equipped.one_piece) : null,
            belt: equipped.belt? this.toItemDTO(equipped.belt) : null,
            powerup: equipped.powerup? this.toItemDTO(equipped.powerup) : null,
            updated_at: equipped.updated_at
        };
    }

    async getAllItems(): Promise<ShopItemDTO[]> {
        const items = await this.shopItemRepo.find();
        return items.map(i => this.toItemDTO(i));
    }

    async getItemById(shop_item_id: string): Promise<ShopItemDTO | null> {
        const item = await this.shopItemRepo.findOne({ where: { shop_item_id } });
        return item ? this.toItemDTO(item) : null;
    }

    async getUserItems(user_id: string): Promise<UserItemDTO[]> {
        const items = await this.userItemRepo.find({
            where: { user: { user_id } },
            relations: { shop_item: true }
        });
        return items.map(i => ({
            user_item_id: i.user_item_id,
            user_id,
            item: this.toItemDTO(i.shop_item),
            acquired_at: i.acquired_at
        }));
    }

    async hasItem(user_id: string, shop_item_id: string): Promise<boolean> {
        const count = await this.userItemRepo.count({
            where: { user: { user_id }, shop_item: { shop_item_id } }
        });
        return count > 0;
    }

    async addUserItem(user_id: string, shop_item_id: string): Promise<UserItemDTO> {
        const saved = await this.userItemRepo.save(this.userItemRepo.create({
            user: { user_id } as any,
            shop_item: { shop_item_id } as any
        }));
        const item = await this.getItemById(shop_item_id);
        return {
            user_item_id: saved.user_item_id,
            user_id,
            item:item!,
            acquired_at: saved.acquired_at
        };
    }

    async getWallet(user_id: string): Promise<WalletDTO | null> {
        const wallet = await this.walletRepo.findOne({
            where: { user: { user_id} },
            relations: { user: true }
        });
        return wallet ? this.toWalletDTO(wallet) : null;
    }

    async createWallet(user_id: string): Promise<WalletDTO | null> {
        const saved = await this.walletRepo.save(this.walletRepo.create({
            user: { user_id } as any,
            balance: 0
        }));
        return this.getWallet(user_id) as Promise<WalletDTO>;
    }

    async updateBalance(user_id: string, delta: number): Promise<WalletDTO> {
        const wallet = await this.walletRepo.findOne({ where: { user: { user_id } } });
        if(!wallet) throw new Error('wallet not found');

        const newBalance = wallet.balance + delta;
        if (newBalance < 0) throw new Error('Insufficient balance');

        await this.walletRepo.update({ wallet_id: wallet.wallet_id }, { balance: newBalance });
        return this.getWallet(user_id) as Promise<WalletDTO>;
    }

    async getEquipped(user_id: string): Promise<EquippedItemsDTO | null> {
        const equipped  = await this.equippedRepo.findOne({
            where: { user: { user_id } },
            relations: { user: true, avatar: true, headwear: true, neckwear: true, facewear: true, belt: true, one_piece: true, powerup: true }
        });
        return equipped ? this.toEquippedDTO(equipped) : null;
    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {
        let equipped = await this. equippedRepo.findOne({ where: { user: { user_id } } });

        const payload: any = {};
        if (updates.avatar_item_id !== undefined) payload.avatar = { shop_item_id: updates.avatar_item_id };
        if (updates.headwear_id)
    }

    async getUserPowerups(user_id: string): Promise<UserItemDTO[]> {
        
    }
}