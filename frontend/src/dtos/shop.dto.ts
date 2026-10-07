/*Copied from backend DTO */
export interface AvatarMetadataDTO {
    asset_key: string;
}

type ShopItemBaseDTO = {
    shop_item_id: string;
    name: string;
    description?: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    created_at: Date;
};

export type ShopItemDTO = ShopItemBaseDTO & { category: 'avatar'; metadata: AvatarMetadataDTO }

export interface EquippedItemsDTO {
    user_id: string;
    avatar: ShopItemDTO | null;
    theme: ShopItemDTO;
    updated_at: Date;
}

export interface UpdatedEquippedDTO {
    avatar_item_id?: string;
    theme_id?: string;
}