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
interface RawThemeMetadata { theme_id: string; hex_color_1: string; hex_color_2: string; hex_color_3: string; is_default?: boolean }
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
    | (RawShopItemBase & { category: 'theme'; metadata: RawThemeMetadata })
    | (RawShopItemBase & { category: 'powerup'; metadata: RawPowerupMetadata })

interface RawUserItem {
    user_item_id: string;
    quantity: number;
    acquired_at: string;
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

// ----- Mappers
function mapItem(raw: RawShopItem): ShopItem {
    const base = {
        id: raw.shop_item_id,
        name:raw.name,
        description: raw.description,
        price: { amount: raw.price },
        rarity: raw.rarity,
    };

    if (raw.category === 'avatar') {
        const avatar: AvatarShopItem = {
            ...base,
            category: 'avatar',
            isDefault: raw.metadata.is_default,
            previewImageUrl: resolve(raw.metadata.asset_key),
        };
        return avatar;
    }

    if (raw.category === 'theme') {
        const theme: ThemeShopItem = {
            ...base,
            category: 'theme',
            themeId: raw.metadata.theme_id,
            isDefault: raw.metadata.is_default,
            swatchColors: [raw.metadata.hex_color_1, raw.metadata.hex_color_2, raw.metadata.hex_color_3],
        };
        return theme;
    }

    const m = raw.metadata;
    const powerup: PowerupShopItem = {
        ...base,
        category: 'powerup',
        kind: m.kind,
        quantityGranted: 1,
        effect: {
            effectType: m.effect as PowerupEffectType,
            targeting: m.targeting,
            durationSeconds: m.duration_seconds ?? undefined,
            magnitude: m.value ?? m.value_seconds ?? m.value_percent,
            maxUsesPerMatch: m.max_uses_per_match,
        },
    };
    return powerup;
}

function mapWallet(raw: RawWallet): Wallet {
    return { stardust: raw.balance };
}

function mapInventory(userItems: RawUserItem[], equipped: RawEquipped): UserInventory {
    const owned: Owned[] = userItems
    .filter((ui) => ui.item.category === 'avatar' || ui.item.category === 'theme')
    .map((ui) => ({
        itemId: ui.item.shop_item_id,
        category: ui.item.category as 'avatar' | 'theme',
        acquiredAt: ui.acquired_at,
    }));

    const consumable: Consumable[] = userItems
        .filter((ui) => ui.item.category === 'powerup')
        .map((ui) => ({
            category: 'powerup',
            itemId: ui.item.shop_item_id,
            quantity: ui.quantity,
        }));

        return {
            owned,
            consumable,
            equippedAvatarId: equipped.avatar?.shop_item_id ?? null,
            equippedThemeId: equipped.theme?.shop_item_id ?? null,
        };
}

function authHeaders(token: string): HeadersInit {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

async function handle<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? body?.message ?? `Request failed (${res.status})`);
    }
    return res.json();
}

export const getCatalog = async () : Promise<ShopItem[]> => {
    const res = await fetch(CATALOG_URL);
    const raw = await handle<RawShopItem[]>(res);
    return raw.map(mapItem);
};

export const getWallet = async (token: string): Promise<Wallet> => {
    const res = await fetch(WALLET_URL, {headers: authHeaders(token) });
    return mapWallet(await handle<RawWallet>(res));
};