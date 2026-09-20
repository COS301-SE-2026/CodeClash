//A try on system for the user to see how an accessory looks before purchasing. 

import { Slot } from "radix-ui";
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

    const reset = useCallback(()=> {
        if (!inventory) {
            return;
        }
        setDraftAvatarId(inventory.equippedAvatarId);
        setDraftAccessories(inventory.equippedAccessories);
    }, [inventory])

    const hasUnsavedChanges = useMemo(() => {
        if (!inventory) {
            return false;
        }
        if (draftAvatarId !== inventory.equippedAvatarId) {
            return true;
        }

        const draft = Object.keys(draftAccessories) as AccessorySlot[];
        const equipped = Object.keys(inventory.equippedAccessories) as AccessorySlot[];
        if (draft.length !== equipped.length) {
            return true;
        }

        return draft.some((k) => draftAccessories[k] !== inventory.equippedAccessories[k]);
    }, [draftAvatarId, draftAccessories, inventory])

    const draftAvatar = useMemo(() => 
        catalog.find((i): i is AvatarShopItem => i.category === 'avatar' && i.id === draftAvatarId), [catalog, draftAvatarId]
    )

    const draftAvatarImg = draftAvatar?.previewImageUrl;

    const draftAccessoryImg = useMemo(() => {
        const res: Partial<Record<AccessorySlot,string>> = {};
        Object.entries(draftAccessories).forEach(([slot, itemId]) => {
            const match = catalog.find((i): i is AccessoryShopItem => i.category === 'accessory' && i.id === itemId);
            if (match?.previewImageUrl) {
                res[slot as AccessorySlot] = match.previewImageUrl;
            }
        })
        return res;
    }, [catalog, draftAccessories])

    const isAvatarUnowned = draftAvatarId ? !isOwned(draftAvatarId) : false;

    const saveOutfit = useCallback(async () => {
        if (!inventory) {
            return;
        }
        setSaving(true);
        try {
            if (draftAvatarId && draftAvatarId !== inventory.equippedAvatarId && isOwned(draftAvatarId)) {
                await equip('avatar', draftAvatarId);
            }
            const changed = Object.keys(draftAccessories) as AccessorySlot[];
            for (const slot of changed) {
                const itemId = draftAccessories[slot];
                if (itemId && itemId !== inventory.equippedAccessories[slot] && isOwned(itemId)) {
                    await toggleAcc(slot, itemId);
                }
            }
            const cleared = (Object.keys(inventory.equippedAccessories) as AccessorySlot[]).filter((slot) => !draftAccessories[slot]);
            for (const slot of cleared) {
                await toggleAcc(slot, inventory.equippedAccessories[slot]!);
            }
            await refetch();
        }
        finally {
            setSaving(false);
        }
    }, [inventory, draftAvatarId, draftAccessories, isOwned, equip, toggleAcc, refetch])

    return {
        draftAvatarId,
        draftAvatar,
        draftAvatarImg,
        draftAccessories,
        draftAccessoryImg,
        isAvatarUnowned,
        hasUnsavedChanges,
        saving,
        tryOnAvatar,
        tryOnAccessories,
        reset,
        saveOutfit
    }
} 