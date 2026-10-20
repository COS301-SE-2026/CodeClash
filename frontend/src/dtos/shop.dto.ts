/*Copied from backend DTO */
export interface AvatarMetadataDTO {
    asset_key: string;
}

export interface PowerupMetadataDTO {
    effect: string;
    value?: number;
    duration_seconds?: number | null;
    max_uses_per_match?: number;
    consumed_on_use?: boolean;
    scope?: string;
}

type ShopItemBaseDTO = {
    shop_item_id: string;
    name: string;
    description?: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    created_at: Date;
};

export type ShopItemDTO = 
    | (ShopItemBaseDTO & { category: 'avatar'; metadata: AvatarMetadataDTO })
    | (ShopItemBaseDTO & { category: 'powerup'; metadata: PowerupMetadataDTO });

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