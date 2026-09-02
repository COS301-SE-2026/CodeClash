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
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Settings;