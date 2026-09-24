//this is the shops 'Avatar tab'

import React from "react";
import { useInventory } from "src/context/Shop/InventoryContext";
import { tryOn } from "src/ViewModels/Shop/TryOn";
import {AvatarRenderer} from "src/avatar/AvatarRenderer"
import type { AvatarShopItem, ShopItem } from "src/Models/ShopModel";
import { Loader2, Sparkles, Users, Check } from "lucide-react";

const PriceTag: React.FC<{amount: number}> = ({amount}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 700}}>
        <Sparkles size={14}/>
        {amount}
    </div>
)

interface AvatarCustomizerProps {
    purchase: (itemId: string) => void;
    purchasingId: string | null;
    canAfford: (item: ShopItem) => boolean;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({purchase, purchasingId, canAfford}) => {
    const {catalog, isOwned, isEquipped} = useInventory();
    const {
        draftAvatarId,
        draftAvatar,
        draftAvatarImg,
        isAvatarUnowned,
        hasUnsavedChanges,
        saving,
        tryOnAvatar,
        saveOutfit
    } = tryOn();

    const avatars = catalog.filter((i): i is AvatarShopItem => i.category === 'avatar');

    let stateLabel: React.ReactNode;
    if (purchasingId === draftAvatarId) {
        stateLabel = (
            <Loader2 size={16} className="animate-spin"/>
        );
    }
    else if (draftAvatar && !canAfford(draftAvatar)){
        stateLabel = "Can't afford";
    }
    else {
        stateLabel = 'Buy';
    }

    return (
        <div>
            <div className="card-glass" style={{padding: '2rem', display: 'flex', gap: '2rem',  flexWrap: 'wrap', alignItems: 'center',marginBottom: '2.5rem'}}>
                <div style={{flex: '1 1 240px', minWidth: '220px'}}>
                    <h2 style={{color: 'var(--primary-text)', fontWeight: 800, fontSize: '3.5rem', marginBottom: '0.5rem'}}>{draftAvatar?.name}</h2>
                    {draftAvatar?.description && (
                        <p className="text-muted" style={{fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.25rem'}}>{draftAvatar.description}</p>
                    )}

                    {isAvatarUnowned ? (
                        <button type="button" onClick={() => draftAvatarId && purchase(draftAvatarId)} disabled={purchasingId === draftAvatarId || (draftAvatar ? !canAfford(draftAvatar): true)} className="btn btn-primary btn-sm">
                            {stateLabel}
                        </button> 
                    ) : (
                        draftAvatarId && isEquipped('avatar', draftAvatarId) ? (
                            <button type="button" disabled className="btn btn-sm" style={{background: 'var(--background-elevated)', color: 'var(--muted)', cursor: 'default'}}>
                                <Check size={14}/>
                                Equipped
                            </button>
                        ) : (
                            <button type="button" onClick={saveOutfit} disabled={!hasUnsavedChanges || saving} className="btn btn-primary btn-sm">
                                {saving? <Loader2 size={14} className="animate-spin"/> : 'Equip'}
                            </button>
                        )
                    )}
                </div>
                <div style={{flex: '0 0 auto'}}>
                    <AvatarRenderer avatarImageUrl={draftAvatarImg} style={{width: '200px', height: 'auto', maxWidth: '40vw'}}/>
                </div>
            </div>

            <div style={{display: 'flex', alignItems: 'center',justifyContent: 'space-between',flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem'}}>
                <h2 className="section-title text-md" style={{display: 'flex', alignItems: 'center',gap: '0.5rem',margin: 0}}>
                    <Users size={18}/>
                    Avatars
                </h2>
            </div>
            <div style={{display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2.5rem'}}>
                {avatars.map((a) => {
                    const owned = isOwned(a.id);
                    const selected = draftAvatarId === a.id;
                    return (
                        <button key={a.id} type="button" onClick={()=> tryOnAvatar(a.id)}
                            style={{position: 'relative', flexShrink: 0, width: '124px', height: '124px', borderRadius: 'var(--radius-md, 18px)', border: selected ? '2px solid var(--primary)' : '1px solid var(--border)',
                                background: 'var(--background-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',overflow: 'hidden', padding: 0
                            }}>
                            {a.previewImageUrl && (
                                <img src={a.previewImageUrl} alt={a.name} style={{width: '100%', height: '100%', objectFit: 'contain'}}/>
                            )}
                            {!owned && (
                                <span style={{position: 'absolute', bottom: 2, right:2, fontSize: '0.6rem', padding: '1px 5px', borderRadius: '999px', background: 'var(--background)', color: 'var(--muted-text)', border: '1px solid var(--border)'}}>
                                    <PriceTag amount={a.price.amount}/>
                                </span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export default AvatarCustomizer;