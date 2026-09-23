import React, {useState} from "react";
import type { ThemeShopItem, PowerupShopItem } from "src/Models/ShopModel";
import { ShopViewModelFunc } from "src/ViewModels/Shop/ShopViewModel";
import { useTheme } from "src/context/Shop/ThemeContext";
import AvatarCustomizer from "./AvatarCustomizer";
import ThemeSwatch from "./ThemeSwatch";
import {Check, Loader2, Sparkles } from "lucide-react";

const Shop:React.FC = () => {
    const {
        tabs, activeTabId, setActiveTabId, itemsByCategory, wallet, loading, error, purchasingId,
        isOwned, isEquipped, powerupQuantity, canAfford, purchase, equip,
    } = ShopViewModelFunc();

    const [powerupFIlter, setPowerupFIlter] = useState<'all' | 'powerup' | 'powerdown'>('all');
    const {setTheme} = useTheme();
    const themes = itemsByCategory('theme') as ThemeShopItem[];
    const powerups = (itemsByCategory('powerup') as PowerupShopItem[]).filter((item) => powerupFIlter === 'all' || item.kind === powerupFIlter);

    return (
        <div className="min-h-screen" style={{background: 'var(--background)', color: 'var(--text)'}}>
            <section style={{padding: '3rem 8% 1.5rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'}}>
                <h1 className="text-l font-black text-primary-text">Shop</h1>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem'}}>
                    <span style={{fontSize: '0.7rem', color: 'var(--muted-text)', textTransform: 'uppercase', letterSpacing: '0.05rem', fontWeight: 700}}>Stardust</span>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '999px', background: 'var(--background-card)', border: '1px solid var(--border)'}}>
                        <Sparkles size={16} color='var(--primary)'/>
                        <span style={{fontWeight: 700, color: 'var(--primary-text)'}}>{wallet.stardust.toLocaleString()}</span>
                    </div>
                </div>
            </section>

            {/*Tabs */}
            <section style={{padding: '0 8%', marginBottom: '1.5rem'}}>
                <div style={{display: 'flex', gap: '0.6rem', overflowX: 'auto', paddingBottom: '0.25rem'}}>
                    {tabs.map((tab) => {
                        const active = activeTabId === tab.id;
                        return (
                            <button key={tab.id} type="button" onClick={()=> setActiveTabId(tab.id)} style={{padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700,border: active ? '1px solid var(--primary)' : '1px solid var(--border)',
                                    background: active ? 'var(--background-card)' : 'var(--transparent)', color: active ? 'var(--primary-text)' : 'var(--muted-text)',  cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s ease'
                                }}>
                                {tab.label}
                            </button>
                        )
                    })}
                </div>
            </section>

            {activeTabId === 'powerups' && (
                <section style={{padding: '0 8%', marginBottom: '1.5rem'}}>
                    <div style={{display: 'flex', gap: '0.5rem'}}>
                        {(['all', 'powerup', 'powerdown'] as const).map((p) => (
                            <button key={p} type="button" onClick={()=> setPowerupFIlter(p)} style={{padding: '0.4rem 0.9rem', borderRadius: '999px',
                                fontSize: '0.75rem', fontWeight: 700, border: powerupFIlter === p ? '1px solid var(--primary)' : '1px solid var(--border)',
                                background: powerupFIlter === p ? 'var(--background-elevated)' : 'transparent', color: powerupFIlter === p ? 'var(--primary-text)' : 'var(--muted-text)', cursor: 'pointer'}}>
                                {p === 'all' ? 'All' : p === 'powerup' ? 'Power Ups' : 'Power Downs'}
                            </button>
                        ))}
                    </div>
                </section>
            )}

            <section style={{padding: '0 8% 6rem'}}>
                {error && (
                    <div style={{marginBottom: '1.5rem', padding: '1rem 1.25rem', borderRadius: 'var(--radius-lg), 20px', background: 'transparent',color: 'var(--danger)'}}>
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-muted text-sm">Loading shop...</p>
                ) : activeTabId === 'avatars' ? (
                    <AvatarCustomizer purchase={purchase} purchasingId={purchasingId} canAfford={canAfford}/>
                ) : activeTabId === 'themes' ? (
                    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem'}}>
                        {themes.map((item) => (
                            <ThemeCard key={item.id} item={item} owned={isOwned(item.id)} equipped={isEquipped('theme', item.id)}
                                affordable={canAfford(item)} purchasing={purchasingId === item.id} onPurchase={() => purchase(item.id)} onEquip={() => {equip('theme', item.id); setTheme(item.themeId as Parameters<typeof setTheme>[0]);
                            }}/>
                        ))}
                    </div>
                ) : activeTabId === 'powerups' ? (
                    powerups.length === 0 ? (
                        <p className="text-muted text-sm">Nothing here yet</p>
                    ) : (
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem'}}>
                            {powerups.map((item) => (
                                <PowerupCard key={item.id} item={item} owned={powerupQuantity()} affordable={canAfford(item)} purchasing={purchasingId === item.id} onPurchase={()=> purchase(item.id)}/>
                            ))}
                        </div>
                    )
                ) : null}
            </section>
        </div>
    )
}

const PriceTag: React.FC<{amount: number}> = ({amount}) => (
    <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 700}}>
        <Sparkles size={14}/>
        {amount}
    </div>
)

const ThemeCard: React.FC<{
    item: ThemeShopItem;
    owned: boolean;
    equipped: boolean;
    affordable: boolean;
    purchasing: boolean;
    onPurchase: () => void;
    onEquip: () => void;
}> = ({item, owned, equipped, affordable, purchasing, onPurchase, onEquip}) => (
    <div className="card-glass" style={{padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem'}}>
        <div style={{display: 'flex', justifyContent: 'center', padding: '0.5rem 0'}}>
            <ThemeSwatch colors={item.swatchColors} size={64}/>
        </div>
        <div style={{textAlign: 'center'}}>
            <h3 style={{color: 'var(--primary-text)', fontWeight: 700, fontSize: '0.95rem'}}>{item.name}</h3>
            {item.description && <p className="text-muted" style={{fontSize: '0.75rem', lineHeight: 1.5, marginTop: '0.25rem'}}>{item.description}</p>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem'}}>
            <PriceTag amount={item.price.amount}/>
            {owned ? (
                equipped ? (
                    <button type="button" disabled className="btn btn-sm" style={{background: 'var(--background-elevated)', color: 'var(--muted)', cursor: 'default'}}>
                        <Check size={14}/>
                        Equipped
                    </button>
                ) : (
                    <button type="button" onClick={onEquip} className="btn btn-sm btn-secondary">Equip</button>
                )
            ) : (
                <button type="button" onClick={onPurchase} disabled={purchasing || !affordable} className="btn btn-sm btn-primary">
                    {purchasing ? <Loader2 size={14} className="animate-spin"/> : affordable ? 'Buy' : "Can't afford"}
                </button>
            )}
        </div>
    </div>
) 

{/*Copied theme card */}
const PowerupCard: React.FC<{
    item: PowerupShopItem;
    owned: number;
    affordable: boolean;
    purchasing: boolean;
    onPurchase: () => void;
}> = ({item, owned, affordable, purchasing, onPurchase}) => {
    return (
        <div className="card-glass" style={{padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.9rem'}}>
            <div>
                <h3 style={{color: 'var(--primary-text)', fontWeight: 900, fontSize: '0.95rem'}}>{item.name}</h3>
                {item.description && <p className="text-muted" style={{fontSize: '0.75rem', lineHeight: 1.5, marginTop: '0.25rem', fontWeight: 400,}}>{item.description}</p>}
                <p className="text-muted" style={{fontSize: '0.7rem', marginTop: '0.4rem', fontWeight: 700,}}>Owned: {owned}</p>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: 'auto'}}>
            <PriceTag amount={item.price.amount}/>
                <button type="button" onClick={onPurchase} disabled={purchasing || !affordable} className="btn btn-sm btn-primary">
                    {purchasing ? <Loader2 size={14} className="animate-spin"/> : affordable ? 'Buy' : "Can't afford"}
                </button>
            </div>
        </div>
    )
}

export default Shop;