//A try on system for the user to see how an accessory looks before purchasing. 

import { useState, useCallback, useMemo, useEffect } from "react";
import type { AccessorySlot, AvatarShopItem, AccessoryShopItem } from "src/Models/ShopModel";
import { useInventory } from "src/context/Shop/InventoryContext";
import { it } from "vitest";

export const tryOn = () => {
    const {catalog, inventory, isOwned, equip, toggleAcc, refetch} = useInventory();
    const [draftAvatarId, setDraftAvatarId] = useState<string | null>(null);
    const [draftAccessories, setDraftAccessories] = useState<Partial<Record<AccessorySlot, string>>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!inventory) {
            return;
        }
        setDraftAvatarId(inventory.equippedAvatarId);
        setDraftAccessories(inventory.equippedAccessories);
    }, [inventory])

    const tryOnAvatar = useCallback((itemId: string) => setDraftAvatarId(itemId), []);
    const tryOnAccessories = useCallback((slot: AccessorySlot, itemId: string) => {
        setDraftAccessories((prev) => {
            if(prev[slot] === itemId) {
                const next = {...prev};
                delete next[slot];
                return next;
            }
            return{...prev, [slot]: itemId};
        })
    }, [])
} 