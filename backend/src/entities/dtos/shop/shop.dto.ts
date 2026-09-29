export interface AvatarMetadata {
    asset_key: string;
}

export interface PowerupMetadata {
    effect: string;
    value?: number;
    duration_seconds?: number | null;
    max_uses_per_match?: number;
    consumed_on_use?: boolean;
    scope?: string;
}

type ShopItemBase = {
    shop_item_id: string;
    name: string;
    description?: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    created_at: Date;
};

export type ShopItemDTO = 
    | (ShopItemBase & { category: 'avatar'; metadata: AvatarMetadata })
    | (ShopItemBase & { category: 'powerup'; metadata: PowerupMetadata });