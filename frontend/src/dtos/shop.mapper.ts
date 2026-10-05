import type { ShopItemDTO, EquippedItemsDTO } from "./shop.dto";
import type { ShopItem, AvatarShopItem} from "src/Models/ShopModel";
import {resolve} from "../assets/Shop/ResolveShopImages";

export function mapShopItemDTO(dto: ShopItemDTO): ShopItem {
    const base = {
        id: dto.shop_item_id,
        name: dto.name,
        description: dto.description,
        price: {amount: dto.price},
        rarity: dto.rarity
    }
        const item: AvatarShopItem = {
            ...base,
            category: 'avatar',
            asset_key: dto.metadata.asset_key,
            previewImageUrl: resolve(dto.metadata.asset_key)
        }
        return item;
}

export function equippedAvatarKeyFromDTO(equipped: EquippedItemsDTO): string | undefined {
    return equipped.avatar?.category === 'avatar' ? equipped.avatar.metadata.asset_key : undefined;
}