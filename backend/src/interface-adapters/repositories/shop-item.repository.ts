import { Repository } from "typeorm";
import { ShopItem } from "src/entities/database/shop-item.entities";
import { IShopItemRepository } from "src/application/interfaces/repositories/IShopItemRepository";
import { ShopItemDTO } from "src/entities/dtos/shop/shop.dto";
export class ShopItemRepository implements IShopItemRepository {
    constructor(
        private readonly shopItemRepo: Repository<ShopItem>,
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

    async getAllItems(): Promise<ShopItemDTO[]> {
            const items = await this.shopItemRepo.find();
            return items.map(i => this.toItemDTO(i));
        }

    async getItemById(shop_item_id: string): Promise<ShopItemDTO | null> {
        const item = await this.shopItemRepo.findOne({ where: { shop_item_id } });
        return item ? this.toItemDTO(item) : null;
    }
}