import { Repository } from "typeorm";
import { EquippedItems } from "src/entities/database/equipped-items.entities";
import { IEquippedRepository } from "src/application/interfaces/repositories/IEquippedRepository";
import { EquippedItemsDTO, UpdatedEquippedDTO } from "src/entities/dtos/shop/equipped-items.dto";
import { ShopItemRepository } from "./shop-item.repository";

export class EquippedRepository implements IEquippedRepository {
    constructor(
        private readonly equippedRepo: Repository<EquippedItems>,
        private readonly shopItemMapper: ShopItemRepository
    ){}

    toDTO(e: EquippedItems): EquippedItemsDTO {
        return {
            user_id: e.user.user_id,
            avatar: e.avatar ? this.shopItemMapper.toDTO(e.avatar) : null,
            powerup: e.powerup ? this.shopItemMapper.toDTO(e.powerup) : null,
            theme: this.shopItemMapper.toDTO(e.theme!),
            updated_at: e.updated_at
        };
    }

    async getEquipped(user_id: string): Promise<EquippedItemsDTO | null> {
        const equipped  = await this.equippedRepo.findOne({
            where: { user: { user_id } },
            relations: { user: true, avatar: true, powerup: true, theme: true }
        });
        return equipped ? this.toDTO(equipped) : null;
    }

    async updateEquipped(user_id: string, updates: UpdatedEquippedDTO): Promise<EquippedItemsDTO> {
        let equipped = await this. equippedRepo.findOne({ where: { user: { user_id } } });

        const payload: any = {};
        if (updates.avatar_item_id !== undefined) payload.avatar = { shop_item_id: updates.avatar_item_id };
        if (updates.powerup_item_id !== undefined) payload.powerup = { shop_item_id: updates.powerup_item_id };
        if (updates.theme_id !== undefined) payload.theme = { shop_item_id: updates.theme_id };

        if (!equipped) {
            await this.equippedRepo.save(this.equippedRepo.create({
                user: { user_id } as any,
                ...payload
            }));
        } else {
            await this.equippedRepo.save({ equipped_id: equipped.equipped_id, ...payload });
        }

        return this.getEquipped(user_id) as Promise<EquippedItemsDTO>;
    }

}