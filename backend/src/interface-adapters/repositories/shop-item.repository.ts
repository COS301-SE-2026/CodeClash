import { Repository } from "typeorm";
import { ShopItem } from "src/entities/database/shop-item.entities";
import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";
export class ShopItemRepository implements IShopItemRepository {
    constructor(
        private readonly shopItemRepo: Repository<ShopItem>,
    ) { }

    toDTO(item: ShopItem): ShopItemDTO {
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

    async getAllItems(): Promise<ShopItemDTO[]> {
        const items = await this.shopItemRepo.find();
        return items.map(i => this.toDTO(i));
    }

    async getItemById(shop_item_id: string): Promise<ShopItemDTO | null> {
        const item = await this.shopItemRepo.findOne({ where: { shop_item_id } });
        return item ? this.toDTO(item) : null;
    }

    async getDefaultTheme(): Promise<ShopItemDTO> {
        const item = await this.shopItemRepo.findOne({
            where: { category: 'theme' },
            order: { price: 'ASC' }
        });
        if (!item) throw new Error('Default theme not seeded');
        return this.toDTO(item);
    }

    async getDefaultAvatar(): Promise<ShopItemDTO> {
        const item = await this.shopItemRepo.findOne({ where: { category: 'avatar', name: 'Vexa' } });
        if (!item) throw new Error('Default avatar not seeded');
        return this.toDTO(item);

    }
}