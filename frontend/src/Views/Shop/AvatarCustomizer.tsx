//this is the shops 'Avatar tab'

import React, { useState } from "react";
import { useInventory } from "src/context/Shop/InventoryContext";
import { tryOn } from "src/ViewModels/Shop/TryOn";
import { SavedViewModelFunc } from "src/ViewModels/Shop/SavedViewModel";
import {AvatarRenderer} from "src/avatar/AvatarRenderer"
import type { AvatarShopItem, AccessoryShopItem, AccessorySlot, Price } from "src/Models/ShopModel";

const accTabs: {id: AccessorySlot; label: string}[] = [
    {
        id: 'headwear',
        label: 'Headwear',
    },
    {
        id: 'neckwear',
        label: 'Neckwear',
    },
    {
        id: 'facewear',
        label: 'Facewear',
    },
    {
        id: 'belt',
        label: 'Belts',
    },
    {
        id: 'cape',
        label: 'Capes & Cloaks',
    }
]

interface AvatarCustomizerProps {
    purchase: (itemId: string) => void;
    purchasingId: string | null;
    canAfford: (item: {price: Price}) => boolean;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({purchase, purchasingId, canAfford}) => {
    const {catalog, isOwned, inventory} = useInventory();
    const {
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
    } = tryOn();
    const {saveCurrentAvatar, saving: savingPreset} = SavedViewModelFunc();

    const [activeSlot, setActiveSlot] = useState<AccessorySlot>('headwear');
    const [presetName, setPresetName] = useState('');
    const [showPreserInput, setShowPresetInput] = useState(false);

    const avatars = catalog.filter((i): i is AvatarShopItem => i.category === 'avatar');
    const accessories = catalog.filter((i): i is AccessoryShopItem => i.category === 'accessory' && i.slot === activeSlot);

    const handleSaveAsPreset = async () => {
        if (!presetName.trim() || !draftAvatarId) {
            return;
        }
        await saveOutfit();
        const ownedAccessories: Partial<Record<AccessorySlot, string>> = {};
        (Object.keys(draftAccessories) as AccessorySlot[]).forEach((slot) => {
            const itemId = draftAccessories[slot];
            if (itemId && isOwned(itemId)) {
                ownedAccessories[slot] = itemId;
            }
        })
        await saveCurrentAvatar({
            name: presetName.trim(),
            avatarId: isOwned(draftAvatarId) ? draftAvatarId : (inventory?.equippedAvatarId ?? draftAvatarId),
            accessories: ownedAccessories
        })
        setPresetName('');
        setShowPresetInput(false);
    }
}