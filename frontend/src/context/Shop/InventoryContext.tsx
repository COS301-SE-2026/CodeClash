//inventory context to fetch wallet, category, and inventory - sharing it with the app and allowing the correct avata + accessories go all across.

import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode } from "react";
import type { ShopItem, Wallet, UserInventory, AccessorySlot, AvatarShopItem, AccessoryShopItem } from "src/Models/ShopModel";
import type { BodyType } from "src/avatar/AvatarRenderer";
import { useAuth } from "../Auth/hooks/useAuth";

import { getCatalog,getWallet, getInv, purchaseItm, equipItm, equipAcc } from "src/services/shop.service.mock"; //to be changed once backedn endpoints implemented

interface InventoryContextValue {
    catalog: ShopItem[];
    wallet: Wallet;
    inventory: UserInventory | null;
    loading: boolean;
    error: string | null;

    equippedAvatarImage?: string;
    equippedAccessoryImage: Partial<Record<AccessorySlot, string>>;
    equippedAvatarBodyType: BodyType;

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
    const {token} = useAuth();
    const [catalog, setCatalog] = useState<ShopItem[]>([]);
    const [wallet, setWallet] = useState<Wallet>({stardust: 0});
    const [inventory, setInventory] = useState<UserInventory | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async () => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
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
    }, [token])

    useEffect(() => {
        if (!token) {
            return;
        }
        void fetchAll();
    }, [fetchAll, token]);

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

    const equippedAvatarBodyType = useMemo((): BodyType => {
        if (!inventory?.equippedAvatarId) {
            return 'slim';
        }
        const avatar = catalog.find((i): i is AvatarShopItem => i.category === 'avatar' && i.id === inventory.equippedAvatarId);
        return avatar?.bodyType ?? 'slim';
    }, [catalog, inventory])

    const purchase = useCallback(async (itemId: string) => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        const res = await purchaseItm(itemId, token);
        setWallet(res.wallet);
        setInventory(res.inventory);
    }, [token])

    const equip = useCallback(async (category: 'avatar' | 'theme', itemId: string) => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        const updated = await equipItm(category, itemId, token);
        setInventory(updated);
    },[token])

    const toggleAcc = useCallback(async (slot: AccessorySlot, itemId: string) => {
        if (!token) {
            setError('Missing or Invalid Token');
            return;
        }
        const already = inventory?.equippedAccessories[slot] === itemId;
        const updated = await equipAcc(slot, already ? null : itemId, token);
        setInventory(updated);
    }, [inventory, token])

    const isOwned = useCallback(
        (itemId: string) => inventory?.owned.some((o) => o.itemId === itemId) ?? false, [inventory]
    )

    const isEquipped = useCallback(
        (category: 'avatar' | 'theme', itemId: string) => {
            if (!inventory) {
                return false;
            }
            if (category === 'avatar') {
                return inventory.equippedAvatarId === itemId;
            }
            return inventory.equippedThemeId === itemId;
        }, [inventory]
    )

    const isAccessoryEquipped = useCallback(
        (slot: AccessorySlot, itemId: string) => inventory?.equippedAccessories[slot] === itemId, [inventory]
    )

    return (
        <InventoryContext.Provider value={{
            catalog,
            wallet,
            inventory,
            loading,
            error,

            equippedAvatarImage,
            equippedAccessoryImage,
            equippedAvatarBodyType,

            refetch: fetchAll,
            purchase,
            equip,
            toggleAcc,

            isOwned,
            isEquipped,
            isAccessoryEquipped,
        }}>
            {children}
        </InventoryContext.Provider>
    )
}

export const useInventory = (): InventoryContextValue => {
    const ctx = useContext(InventoryContext);
    if (!ctx) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return ctx;
}