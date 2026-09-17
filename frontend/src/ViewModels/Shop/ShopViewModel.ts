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
        categories: ['avatar', 'accessory']
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
        catalog, wallet, inventory, loading, error: inventoryError, purchase: purchaseFromContext, equip, toggleAcc, isOwned, isEquipped, isAccessoryEquipped
    } = useInventory();

    const [activeTabId, setActiveTabId] = useState('avatars');
    const [purchasingId, setPurchasingId] = useState<string | null>(null);
    const [purchaseError, setPurchaseError] = useState<string | null>(null);

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
        () => inventory?.consumable.find((c) => c.category === 'powerup')?.quantity ?? 0, [inventory]
    )

    const canAfford = useCallback(
        (item: ShopItem) => wallet.stardust >= item.price.amount, [wallet] 
    )
}