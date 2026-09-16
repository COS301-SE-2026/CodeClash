//The model will contain domain/ui types and the request/response shapes will live in a dto

export interface Price {
    amount: number;
}

export type ShopCategory = 'avatar' | 'accessory' | 'theme' | 'powerup';

export type AccessorySlot = 'top' | 'outerwear' | 'bottom' | 'dress' | 'headwear' | 'neckwear' | 'belt' | 'facewear' | 'cape';

interface ShopItemBase {
    id: string;
    category: ShopCategory;
    name: string;
    description?: string;
    rarity?: 'common' | 'rare' | 'epic' | 'legendary';
    previewImageUrl?: string; //a thumbnail
}

//we're doing flat images for the avatars, bacuse animations and svgs take too long. We can later on use css for some slight more meaningful animations
export interface AvatarShopItem extends ShopItemBase {
    category: 'avatar';
    isDefault?: boolean; //for a 'starter' avatar granted to all users at sign up time
}

export interface AccessoryShopItem extends ShopItemBase {
    category: 'accessory';
    slot: AccessorySlot; //universal that is going to work on any selected (purchased) avatr
}

export interface ThemeShopItem extends ShopItemBase {
    category: 'theme';
    themeId: string;
    swatchColors: string[]; //i want a pie wedge preview of some of the theme colors, not just one dot with one color
    isDefault?: boolean; //current cosmos dark will be default to all users at sign up time
}

export type PowerupEffectType = 'bug' | 'wipe' | 'questionVisibility' | 'timeDown' | 'timeUp' | 'lifeDrain' | 'hint' | 'shield' | 'scoreBoost' | 'secondWind';

export interface PowerupEffectConf {
    effectType: PowerupEffectType;
    targeting: 'self' | 'opponent';
    durationSeconds?: number;
    magnitude?: number;
    maxUsesPerMatch?: number;
    notes?: string;
}

export interface PowerupShopItem extends ShopItemBase {
    category: 'powerup';
    kind: 'powerup' | 'powerdown';
    effect: PowerupEffectConf;
    quantityGranted: number;
}

export type ShopItem = AvatarShopItem | AccessoryShopItem | ThemeShopItem | PowerupShopItem;

export interface Wallet {
    stardust: number;
}

export interface Owned {
    category: 'avatar' | 'accessory' | 'theme';
    acquiredAt: string;
}

export interface Consumable {
    category: 'powerup';
    quantity: number;
}