//inventory context to fetch wallet, category, and inventory - sharing it with the app and allowing the correct avata + accessories go all across.

import { Slot } from "radix-ui";
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { ShopItem, Wallet, UserInventory, AccessorySlot, AvatarShopItem, AccessoryShopItem } from "src/Models/ShopModel";
import { getCatalog,getWallet, getInv, purchaseItm, equipItm, equipAcc } from "src/services/shop.service.mock";

interface InventoryContextValue {
    catalog: ShopItem[];
    wallet: Wallet;
    inventory: UserInventory | null;
    loading: boolean;
    error: string | null;

    equippedAvatarImage?: string;
    equippedAccessoryImage: Partial<Record<AccessorySlot, string>>;

    refetch: () => Promise<void>;
    purchase: (itemId: string) => Promise<void>;
    equip: (category: 'avatar' | 'theme', itemId: string) => Promise<void>;
    toggleAcc: (slot: AccessorySlot, itemId: string) => Promise<void>;

    isOwned: (itemId: string) => boolean;
    isEquipped: (category: 'avatar' | 'theme', itemId: string) => boolean;
    isAccessoryEquipped: (slot: AccessorySlot, itemId: string) => boolean;
}

const InventoryContext = createContext<InventoryContextValue | undefined>(undefined);

export const InventoryProvider = ({children}: {children: ReactNode}) => {
    const [catalog, setCatalog] = useState<ShopItem[]>([]);
    const [wallet, setWallet] = useState<Wallet>({stardust: 0});
    const [inventory, setInventory] = useState<UserInventory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [c,w,i] = await Promise.all([getCatalog(), getWallet(), getInv()]);
            setCatalog(c);
            setWallet(w);
            setInventory(i);
        }
        catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to load inventory');
        }
        finally {
            setLoading(false);
        }
    }, [])

    useEffect(() => {fetchAll();}, [fetchAll]);

    const equippedAvatarImage = useMemo(() => {
        if (!inventory?.equippedAvatarId) {
            return undefined;
        }
        const avatar = catalog.find((i): i is AvatarShopItem => i.category === 'avatar' && i.id === inventory.equippedAvatarId);

        return avatar?.previewImageUrl;
    }, [catalog, inventory])

    const equippedAccessoryImage = useMemo(() => {
        if (!inventory) {
            return {};
        }
        const result: Partial<Record<AccessorySlot, string>> = {};
        Object.entries(inventory.equippedAccessories).forEach(([slot, itemId]) => {
            const match = catalog.find((i): i is AccessoryShopItem => i.category === 'accessory' && i.id === itemId);
            if (match?.previewImageUrl) {
                result[slot as AccessorySlot] = match.previewImageUrl;
            }
        })
        return result;
    }, [catalog, inventory])

    const purchase = useCallback(async (itemId: string) => {
        const res = await purchaseItm(itemId);
        setWallet(res.wallet);
        setInventory(res.inventory);
    }, [])

    const equip = useCallback(async (category: 'avatar' | 'theme', itemId: string) => {
        const updated = await equipItm(category, itemId);
        setInventory(updated);
    },[])

    const toggleAcc = useCallback(async (slot: AccessorySlot, itemId: string) => {
        const already = inventory?.equippedAccessories[slot] === itemId;
        const updated = await equipAcc(slot, already ? null : itemId);
        setInventory(updated);
    }, [inventory])
}

export const useInventory = (): InventoryContextValue => {
    const ctx = useContext(InventoryContext);
    if (!ctx) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return ctx;
}