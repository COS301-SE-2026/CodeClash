import React from "react";
import { SettingsViewModelFunc } from "src/ViewModels/SettingsViewModel";

const Settings: React.FC = () => {
    const {theme, setTheme, themes} = SettingsViewModelFunc();

    return (
        <div className="min-h-screen" style={{background: 'var(--background)', color: 'var(--text)'}}>
            <section style={{padding: '3rem 8% 2rem', textAlign: 'center'}}>
                <h1 className="text-xl font-black text-primary-text mb-3">Settings</h1>
            </section>

            <section style={{padding: '0 8% 6rem'}}>
                <div style={{maxWidth: '700px', margin: '0 auto'}}>
                    <h2 className="section-title text-md mb-4">Appearance</h2>
                    <div className="card-glass" style={{padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem'}}>
                        <div>
                            <h3 style={{marginBottom: '0.35rem', color: 'var(--primary-text)', fontWeight: 700}}>Theme</h3>
                            <p className="section-description text-xsm" style={{lineHeight: 1.6}}>Pick a theme</p>
                        </div>
                        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem'}}>
                            {themes.map((t) => {
                                const selected = theme === t.id;
                                return (
                                    <button key={t.id} type="button" role="radio" aria-checked={selected} aria-label= {`Use ${t.label} theme`}
                                        onClick={() => setTheme(t.id)} style={{display: 'flex', alignItems: 'center', gap: '0.65rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-lg, 20px)', border: selected ? '2px solid var(--primary)': '1px solid var(--border)', 
                                        background: selected ? 'var(--background-elevated)': 'transparent', cursor: 'pointer', transition: 'all 0.2s ease'}}>
                                        <span style={{width: '18px', height: '18px', borderRadius: '999px', 
                                            background: t.swatch, flexShrink: 0, boxShadow: selected ? '0 0 0 3px var(--background-card), 0 0 0 4px var(--primary)': 'none'}}
                                        />
                                        <span style={{color: 'var(--primary-text)', fontSize: '0.85rem', fontWeight: selected ? 700: 500}}>
                                            {t.label}
                                        </span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings;