import { Settings } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getAudioPrefs, playSfx, setAudioPrefs } from "src/utils/audio";

const Toggle = ({ label, on, onChange }: { label: string; on: boolean; onChange: () => void }) => (
    <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onChange}
        className="flex w-full items-center justify-between gap-6 py-2 text-sm text-primary-text"
    >
        {label}
        <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? 'bg-primary' : 'bg-border'}`}>
            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${on ? 'left-[1.1rem]' : 'left-0.5'}`} />
        </span>
    </button>
);

export const AudioSettings = () => {
    const [open, setOpen] = useState(false);
    const [prefs, setPrefs] = useState(getAudioPrefs);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!open) return;
        const onDown = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDown);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    const toggle = ( key: 'music' | 'sfx') => {
        setAudioPrefs(key === 'music' ? { music: !prefs.music } : { sfx: !prefs.sfx });
        setPrefs(getAudioPrefs());
        if (key === 'sfx' && getAudioPrefs().sfx) playSfx('notification'); //preview
    };

    return (
        <div ref={ref} className="relative">
            <button 
                type="button"
                onClick={() => setOpen(o => !o)}
                arioa-label="Audio settings"
                aria-expanded={open}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-text hover:text-primary-text transition-colors"
            >
                <Settings size={18} />
            </button>
            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-border bg-background p-4 shadow-md">
                    <p className="mb-1 text-xs font-bold uppercase tracking-wide text-secondary">Audio</p>
                    <Toggle label="Music" on={prefs.music} onChange={() => toggle('music')} />
                    <Toggle label="Sound effects" on={prefs.sfx} onChange={() => toggle('sfx')} />
                </div>
            )}
        </div>
    );
};