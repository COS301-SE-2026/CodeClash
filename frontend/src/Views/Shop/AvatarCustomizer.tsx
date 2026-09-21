//this is the shops 'Avatar tab'

import React, { useState } from "react";
import { useInventory } from "src/context/Shop/InventoryContext";
import { tryOn } from "src/ViewModels/Shop/TryOn";
import { SavedViewModelFunc } from "src/ViewModels/Shop/SavedViewModel";
import {AvatarRenderer} from "src/avatar/AvatarRenderer"
import type { AvatarShopItem, AccessoryShopItem, AccessorySlot, Price } from "src/Models/ShopModel";
import { BookmarkPlus, Check, Loader2, RotateCcw, Save } from "lucide-react";

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
            
            <div className="card-glass" style={{padding: '2rem', display: 'flex', gap: '2rem',  flexWrap: 'wrap', alignItems: 'center',marginBottom: '2.5rem'}}>
                <div style={{flex: '0 0 auto'}}>
                    <AvatarRenderer avatarImageUrl={draftAvatarImg} bodyType={draftAvatar?.bodyType} accessories={draftAccessoryImg} style={{width: '200px', height: 'auto'}}/>
                </div>
                <div style={{flex: '1 1 240px', minWidth: '220px'}}>
                    <h2 style={{color: 'var(--primary-text)', fontWeight: 800, fontSize: '1.4rem', marginBottom: '0.5rem'}}>{draftAvatar?.name}</h2>
                    {draftAvatar?.description && (
                        <p className="text-muted" style={{fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem'}}>{draftAvatar.description}</p>
                    )}

                    {isAvatarUnowned ? (
                        <button type="button" onClick={() => draftAvatarId && purchase(draftAvatarId)} disabled={purchasingId === draftAvatarId || (draftAvatar ? !canAfford(draftAvatar): true)} className="btn btn-primary">
                            {purchasingId === draftAvatarId ? <Loader2 size={16} className="animate-spin"/> : `Buy - ${draftAvatar?.price.amount ?? ''}`}
                        </button> 
                    ) : (
                        <div>
                            <div style={{display: 'flex',gap: '0.75rem', marginBottom: showPreserInput ? '0.75rem' : 0}}>
                                <button type="button" onClick={saveOutfit} disabled={!hasUnsavedChanges || saving} className="btn btn-primary">
                                    {saving? <Loader2 size={14} className="animate-spin"/> : <><Save size={14}/>Save Outfit</>}
                                </button>
                                <button type="button" onClick={reset} disabled={!hasUnsavedChanges || saving} className="btn btn-primary">
                                    <RotateCcw size={14}/>Reset to Default
                                </button>
                                <button type="button" onClick={() => setShowPresetInput((v) => !v)} className="btn btn-primary">
                                    <BookmarkPlus size={14}/>Save as preset
                                </button>
                            </div>

                            {showPreserInput && (
                                <div style={{display: 'flex', gap: '0.5rem'}}>
                                    <input type="text" value={presetName} onChange={(e)=> setPresetName(e.target.value)} placeholder="Name this look.." className="input" style={{maxWidth: '220px'}}/>
                                    <button type="button" onClick={handleSaveAsPreset} disabled={!presetName.trim() || savingPreset} className="btn btn-secondary">
                                        {savingPreset? <Loader2 size={14} className="animate-spin"/> : 'Save'}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <h2 className="section-title text-md mb-4">Wardrobe & Accessories</h2>
            <div style={{display: 'flex',gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.5rem'}}>
                {accTabs.map((tab) => {
                    const active = activeSlot === tab.id;
                    return (
                        <button key={tab.id} type="button" onClick={()=> setActiveSlot(tab.id)}  
                            style={{padding: '0.5rem 1rem', borderRadius: '999px', fontSize: 700,border: active ? '2px solid var(--primary)' : '1px solid var(--border)',
                                    background: active ? 'var(--primary)' : 'var(--background-card)', color: active ? 'var(--muted)' : 'var(--primary)',  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                                }}>
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem'}}>
                {accessories.map((item) => {
                    const owned = isOwned(item.id);
                    const inDraft = draftAccessories[item.slot] === item.id;
                    return (
                        <AccessoryCards key={item.id} item={item} owned={owned} inDraft={inDraft} purchasing={purchasingId === item.id}
                            affordable={canAfford(item)} onTryOn={()=> tryOnAccessories(item.slot, item.id)} onBuy={()=> purchase(item.id)}/>
                    )
                })}
                {accessories.length === 0 && (
                    <p className="text-muted text-sm">Nothing in this category yet.</p>
                )}
            </div>
        </div>
    )
}

interface AccessoryCardsProps {
    item: AccessoryShopItem;
    owned: boolean;
    inDraft: boolean;
    purchasing: boolean;
    affordable: boolean;
    onTryOn: () => void;
    onBuy: () => void;
}

const AccessoryCards: React.FC<AccessoryCardsProps> = ({item,owned, inDraft, purchasing, affordable, onTryOn, onBuy}) => (
    <div onClick={onTryOn} className="card-glass" style={{padding: '1.1rem', display: 'flex', flexDirection: 'column', 
        border: inDraft ? '2px solid var(--primary)' : '1px solid var(--border)',gap: '0.6rem',  cursor: 'pointer'}}>
        {inDraft && (
            <span className="badge" style={{fontSize: '0.65rem',border: '1px solid var(--primary)',
                background: 'var(--primary)' , color: 'var(--success)'}}>
                {owned ? <><Check size={11}/> Equipped</>: 'Previewing'}
            </span>
        )}
        <div style={{height: '90px', borderRadius : 'var(--radius-md, 18px)', background: 'var(--background-elevated)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
            {item.previewImageUrl && <img src={item.previewImageUrl} alt={item.name} style={{maxHeight: '100%', maxWidth: '100%', objectFit: 'contain'}}/>}
        </div>
        <p style={{color: 'var(--primary-text)', fontWeight: 700, fontSize: '0.85rem'}}>{item.name}</p>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <span style={{fontSize: '0.75rem', color: 'var(--muted)', fontWeight: 700}}>{item.price.amount}</span>
            {!owned && (
                <button type="button" onClick={(e) => {e.stopPropagation(); onBuy();}} disabled={purchasing || !affordable} className="btn btn-primary">
                    {purchasing ? <Loader2 size={13} className="animate-spin"/> : affordable ? 'Buy': "Can't afford"}
                </button>
            )}
        </div>
    </div>
)

export default AvatarCustomizer;