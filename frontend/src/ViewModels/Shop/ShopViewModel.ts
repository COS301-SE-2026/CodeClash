import { useCallback, useMemo, useState } from "react";
import type { ShopCategory, ShopItem } from "src/Models/ShopModel";
import { useInventory } from "src/context/Shop/InventoryContext";

export interface ShopTab {
    id: string;
    label: string;
    categories: ShopCategory[];
}

export const Tabs: ShopTab[] = [
    {
        id: 'avatars',
        label: 'Avatars',
        categories: ['avatar']
    },
    {
        id: 'themes',
        label: 'Themes',
        categories: ['theme']
    },
    {
        id: 'powerups',
        label: 'Power-Ups',
        categories: ['powerup']
    },
]

export const ShopViewModelFunc = () => {
    const {
        catalog, wallet, inventory, loading, error: inventoryError, purchase: purchaseFromContext, equip: equipFromContext, isOwned, isEquipped
    } = useInventory();

    const [activeTabId, setActiveTabId] = useState('avatars');
    const [purchasingId, setPurchasingId] = useState<string | null>(null);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);
    const [equipError, setEquipError] = useState<string | null>(null);

    const activeTab = useMemo(
        () => Tabs.find((t) => t.id === activeTabId) ?? Tabs[0], [activeTabId]
    )

    const items = useMemo(
        () => catalog.filter((item) => activeTab.categories.includes(item.category)), [catalog, activeTab]
    )

    const itemsByCategory = useCallback(
        (category: ShopCategory) => items.filter((i) => i.category === category), [items]
    )

    const powerupQuantity = useCallback(
        (itemId: string) => inventory?.consumable.find((c) => c.shop_item_id === itemId)?.quantity ?? 0, [inventory]
    )

    const canAfford = useCallback(
        (item: ShopItem) => wallet.stardust >= item.price.amount, [wallet] 
    )

    const purchase = useCallback(async (itemId: string) => {
        setPurchasingId(itemId);
        setPurchaseError(null);

        try {
            await purchaseFromContext(itemId);
        }
        catch (e) {
            setPurchaseError(e instanceof Error ? e.message : 'Purchase failed');
        }
        finally {
            setPurchasingId(null);
        }
    }, [purchaseFromContext])

    // Resolves to true only once the server has saved the equip, so callers can apply it afterwards
    const equip = useCallback(async (category: 'avatar' | 'theme', itemId: string): Promise<boolean> => {
        setEquipError(null);

        try {
            await equipFromContext(category, itemId);
            return true;
        }
        catch (e) {
            setEquipError(e instanceof Error ? e.message : 'Equip failed');
            return false;
        }
    }, [equipFromContext])

    return {
        tabs: Tabs,
        activeTabId,
        setActiveTabId,
        items,
        itemsByCategory,
        wallet, 
        inventory,
        loading,
        error: inventoryError ?? purchaseError ?? equipError,
        purchasingId,
        isOwned,
        isEquipped,
        powerupQuantity,
        canAfford,
        purchase,
        equip,
    }
}