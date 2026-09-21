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

    return (
        <div>
            <div style={{display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>
                {avatars.map((a) => {
                    const owned = isOwned(a.id);
                    const selected = draftAvatarId === a.id;
                    return (
                        <button key={a.id} type="button" onClick={()=> tryOnAvatar(a.id)}
                            style={{position: 'relative', flexShrink: 0, width: '64px', height: '64px', borderRadius: 'var(--radius-md, 18px)', border: selected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: 'var(--background-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',overflow: 'hidden', padding: 0
                            }}>
                            {a.previewImageUrl && (
                                <img src={a.previewImageUrl} alt={a.name} style={{width: '100%', height: '100%', objectFit: 'cover'}}/>
                            )}
                            {!owned && (
                                <span style={{position: 'absolute', bottom: 2, right:2, fontSize: '0.6rem', padding: '1px 5px', borderRadius: '999px', background: 'var(--background)', color: 'var(--muted-text)', border: '1px solid var(--border)'}}>
                                    {a.price.amount}
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
            
        </div>
    )
}