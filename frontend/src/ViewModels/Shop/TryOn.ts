//A try on system for the user to see how an accessory looks before purchasing. 

import { useState, useCallback, useMemo, useEffect } from "react";
import type {  AvatarShopItem, } from "src/Models/ShopModel";
import { useInventory } from "src/context/Shop/InventoryContext";

export const tryOn = () => {
    const {catalog, inventory, isOwned, equip, refetch} = useInventory();
    const [draftAvatarId, setDraftAvatarId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!inventory) {
            return;
        }
        setDraftAvatarId(inventory.equippedAvatarId);
    }, [inventory])

    const tryOnAvatar = useCallback((itemId: string) => setDraftAvatarId(itemId), []);

    const reset = useCallback(()=> {
        if (!inventory) {
            return;
        }
        setDraftAvatarId(inventory.equippedAvatarId);
    }, [inventory])

    const hasUnsavedChanges = useMemo(() => {
        if (!inventory) {
            return false;
        }

        return draftAvatarId !== inventory.equippedAvatarId;
    }, [draftAvatarId, inventory])

    const draftAvatar = useMemo(() => 
        catalog.find((i): i is AvatarShopItem => i.category === 'avatar' && i.id === draftAvatarId), [catalog, draftAvatarId]
    )

    const draftAvatarImg = draftAvatar?.previewImageUrl;

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
            await refetch();
        }
        finally {
            setSaving(false);
        }
    }, [inventory, draftAvatarId, isOwned, equip, refetch])

    return {
        draftAvatarId,
        draftAvatar,
        draftAvatarImg,
        isAvatarUnowned,
        hasUnsavedChanges,
        saving,
        tryOnAvatar,
        reset,
        saveOutfit
    }
} 