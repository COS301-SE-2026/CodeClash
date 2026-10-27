import type { ShopItemDTO, EquippedItemsDTO } from "./shop.dto";
import type { ShopItem, AvatarShopItem, PowerupShopItem } from "src/Models/ShopModel";
import {resolve} from "../assets/Shop/ResolveShopImages";

export function mapShopItemDTO(dto: ShopItemDTO): ShopItem {
    const base = {
        id: dto.shop_item_id,
        name: dto.name,
        description: dto.description,
        price: {amount: dto.price},
        rarity: dto.rarity
    }

    if (dto.category === 'avatar') {
        const item: AvatarShopItem = {
            ...base,
            category: 'avatar',
            asset_key: dto.metadata.asset_key,
            previewImageUrl: resolve(dto.metadata.asset_key)
        }
        return item;
    }

    const item: PowerupShopItem = {
        ...base,
        category: 'powerup',
        kind: dto.metadata.value && dto.metadata.value < 0 ? 'powerdown' : 'powerup',
        effect: {
            effectType: dto.metadata.effect as PowerupShopItem['effect']['effectType'],
            targeting: 'opponent',
            durationSeconds: dto.metadata.duration_seconds ?? undefined,
            magnitude: dto.metadata.value,
            maxUsesPerMatch: dto.metadata.max_uses_per_match,
        },
        quantityGranted: 1
    }
    return item;
}

export function equippedAvatarKeyFromDTO(equipped: EquippedItemsDTO): string | undefined {
    return equipped.avatar?.category === 'avatar' ? equipped.avatar.metadata.asset_key : undefined;
}