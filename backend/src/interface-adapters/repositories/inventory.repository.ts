    import { Repository } from "typeorm";
import { UserItem } from "src/entities/database/user-item.entities";
import { IInventoryRepository } from "src/application/interfaces/repositories/IInventoryRepository";
import { UserItemDTO } from "src/entities/dtos/shop/user-item.dto";
import { ShopItemRepository } from "./shop-item.repository";

export class InventoryRepository implements IInventoryRepository {
    constructor (
        private readonly userItemRepo: Repository<UserItem>,
        private readonly shopItemMapper: ShopItemRepository
    ){}

    private toDTO(i: UserItem): UserItemDTO {
        return {
            user_item_id: i.user_item_id,
            user_id: i.user.user_id,
            item: this.shopItemMapper.toDTO(i.shop_item),
            acquired_at: i.acquired_at,
            quantity: i.quantity
        };
    }

    async getUserItems(user_id: string): Promise<UserItemDTO[]> {
        const items = await this.userItemRepo.find({
            where: { user: { user_id } },
            relations: { user: true, shop_item: true }
        });
        return items.map(i => this.toDTO(i));
    }

    async hasItem(user_id: string, shop_item_id: string): Promise<boolean> {
        const count = await this.userItemRepo.count({
            where: { user: { user_id }, shop_item: { shop_item_id } }
        });
        return count > 0;
    }

    async getUserPowerups(user_id: string): Promise<UserItemDTO[]> {
            const items = await this.userItemRepo.find({
                where: { user: { user_id }, shop_item: { category: 'powerup' } },
                relations: { user: true, shop_item: true }
            });

            return items.map(i => this.toDTO(i));
        }

    async consumeItem(user_id: string, shop_item_id: string): Promise<void> {
        const user_item= await this.userItemRepo.findOne({
            where: { user: { user_id }, shop_item: { shop_item_id } }
        });

        if (!user_item || user_item.quantity <= 0) {
            throw new Error('Item not owned');
        }

        if (user_item.quantity === 1) {
            await this.userItemRepo.delete({ user_item_id: user_item.user_item_id });
        } else {
            await this.userItemRepo.update({ user_item_id: user_item.user_item_id }, { quantity: user_item.quantity -1 });
        }
    }

    async grantItem(user_id: string, shop_item_id: string): Promise<void> {
        const existing = await this.userItemRepo.findOne({
            where: { user: {user_id}, shop_item: {shop_item_id}}
        });
        if (existing) return;

        await this.userItemRepo.save(this.userItemRepo.create({
            user: { user_id } as any,
            shop_item: { shop_item_id } as any
        }));
    }
}