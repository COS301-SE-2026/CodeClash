import React, {useState} from "react";
import type { ThemeShopItem, PowerupShopItem } from "src/Models/ShopModel";
import { ShopViewModelFunc } from "src/ViewModels/Shop/ShopViewModel";
import { useTheme } from "src/context/Shop/ThemeContext";
import AvatarCustomizer from "./AvatarCustomizer";
import ThemeSwatch from "./ThemeSwatch";
import {Sparkles } from "lucide-react";

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

        </div>
    )
}
export default Shop;