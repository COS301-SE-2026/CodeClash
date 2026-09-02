import React from "react";
import { SettingsViewModelFunc } from "src/ViewModels/SettingsViewModel";

const Settings: React.FC = () => {
    const {isLight, toggleTheme} = SettingsViewModelFunc();

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
                            <p className="section-description text-xsm" style={{lineHeight: 1.6}}>Switch to light mode</p>
                        </div>
                
                        <button type="button" role="switch" aria-checked={isLight} aria-label= {`Switch to ${isLight ? 'dark' : 'light'} mode`}
                            onClick={toggleTheme} style={{position: 'relative', width: '64px', height: '34px', borderRadius: '999px', border: '1px solid var(--border)', 
                            background: isLight ? 'var(--secondary)' : 'rgba(252,236, 221, 0.08)', flexShrink: 0, cursor: 'pointer', transition: 'background 0.2s ease'}}>
                            <span style={{position: 'absolute', top: '3px', left: isLight ? '33px' : '3px', width: '26px', height: '26px', borderRadius: '999px', 
                                background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)', transition: 'left 0.2s ease'}}>
                            </span>
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings;