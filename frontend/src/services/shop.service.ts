import type {
    ShopItem, AvatarShopItem, ThemeShopItem,
    Wallet, UserInventory, Owned,
} from "src/Models/ShopModel";

import { resolve } from "../assets/Shop/ResolveShopImages";

const CATALOG_URL = "/api/shop/items";
const WALLET_URL = "/api/shop/wallet";
const INVENTORY_URL = "/api/shop/items/me";
const EQUIPPED_URL = "/api/shop/equipped";
const PURCHASE_URL = "/api/shop/purchase";
const EQUIP_URL = "/api/shop/equipped";

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

type RawShopItem = 
    | (RawShopItemBase & { category: 'avatar'; metadata: RawAvatarMetadata })
    | (RawShopItemBase & { category: 'theme'; metadata: RawThemeMetadata })

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
// The shop seeds the default themes as cosmos-dark/cosmos-light, but the CSS theme classes are dark/light
const THEME_KEY_ALIASES: Record<string, string> = { 'cosmos-dark': 'dark', 'cosmos-light': 'light' };

function toThemeKey(theme_id: string): string {
    return THEME_KEY_ALIASES[theme_id] ?? theme_id;
}

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

        const theme: ThemeShopItem = {
            ...base,
            category: 'theme',
            themeId: toThemeKey(raw.metadata.theme_id),
            isDefault: raw.metadata.is_default,
            swatchColors: [raw.metadata.hex_color_1, raw.metadata.hex_color_2, raw.metadata.hex_color_3],
        };
        return theme;
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

        return {
            owned,
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
        console.error(`Request failed (${res.status})`)
        throw new Error(body?.error ?? body?.message ?? `Request failed (${res.status})`);
    }
    return res.json();
}

export const getCatalog = async (token: string) : Promise<ShopItem[]> => {
    const res = await fetch(CATALOG_URL, {headers: authHeaders(token) });
    const raw = await handle<RawShopItem[]>(res);
    return raw.map(mapItem);
};

export const getWallet = async (token: string): Promise<Wallet> => {
    const res = await fetch(WALLET_URL, {headers: authHeaders(token) });
    return mapWallet(await handle<RawWallet>(res));
};

export const getInv = async (token: string): Promise<UserInventory> => {
    const [userItemsRes, equippedRes] = await Promise.all([
        fetch(INVENTORY_URL, { headers: authHeaders(token) }),
        fetch(EQUIPPED_URL, { headers: authHeaders(token) }),
    ]);

    const userItems = await handle<RawUserItem[]>(userItemsRes);
    const equipped = await handle<RawEquipped>(equippedRes);

    return mapInventory(userItems, equipped);
};

export const purchaseItm = async (
    itemId: string,
    token: string
): Promise<{ wallet: Wallet; inventory: UserInventory }> => {
    const res = await fetch(PURCHASE_URL, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ shop_item_id: itemId }),
    });

    await handle(res);

    const [wallet, inventory] = await Promise.all([getWallet(token), getInv(token)]);
    return { wallet, inventory };
}

export const equipItm = async (
    category: 'avatar' | 'theme',
    itemId: string,
    token: string
): Promise<UserInventory> => {
    const payload: { avatar_item_id?: string; theme_id?: string } =
        category === 'avatar' ? { avatar_item_id: itemId } : { theme_id: itemId };

    const res = await fetch(EQUIP_URL, {
        method: 'PATCH',
        headers: authHeaders(token),
        body: JSON.stringify(payload),
    });

    await handle(res);
    return getInv(token);
}