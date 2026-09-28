import type {
    ShopItem, AvatarShopItem, ThemeShopItem, PowerupShopItem,
    Wallet, UserInventory, Owned, Consumable, PowerupEffectType
} from "src/Models/ShopModel";

import { resolve } from "../assets/Shop/ResolveShopImages";

const CATALOG_URL = "/api/shop/items";
const WALLET_URL = "/api/shop/wallet";
const INVENTORY_URL = "/api/shop/inventory";
const EQUIPPED_URL = "/api/shop/equipped";
const PURCHASE_URL = "/api/shop/purchase";
const EQUIP_IRL = "/api/shop/equip";

interface RawShopItemBase {
    shop_item_id: string;
    name: string;
    description?: string;
    price: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    created_id: string;
}

interface RawAvatarMetadata { asset_key: string; is_default?: boolean }
interface RawThemeMetadata { theme_id: string; hex_color_1: string; hex_color_2: string; is_default?: boolean }
interface RawPowerupMetadata {
    effect: string;
    kind: 'powerup' | 'powerdown';
    targeting: 'self' | 'opponent';
    value?: number;
    value_seconds?: number;
    value_percent?: number;
    duration_seconds?: number | null;
    max_uses_per_match?: number;
    consumed_on_use?: boolean;
    scope?: string;
}

type RawShopItem = 
    | (RawShopItemBase & { category: 'avatar'; metadata: RawAvatarMetadata })
    | (RawShopItemBase & { category: 'theme'; metadata: RawAvatarMetadata })
    | (RawShopItemBase & { category: 'powerup'; metadata: RawAvatarMetadata })

    interface RawUserItem {
        user_item_id: string;
        quantity: number;
        acqired_at: string;
        item: RawShopItem;
    }

    interface RawWallet {
        wallet_id: string;
        balance: number;
        updated_at: string;
    }

    interface RawEquipped {
        avatar: RawShopItem | null;
        theme: RawShopItem | null;   
    }