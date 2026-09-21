//this is the shops 'Avatar tab'

import React from "react";
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
}