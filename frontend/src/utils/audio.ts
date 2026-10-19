const SFX = {
    life_lost: '/audio/life-lost.mp3',
    powerup: 'audio/powerup.mp3',
    powerdown: '/audio/powerdown.mp3',
    achievement: '/audio/achievement.mp3',
    friend_request: '/audio/friend-request.mp3',
    friend_accepted: '/audio/notification.mp3',
} as const;

const MUSIC = {
    match: '/audio/music-match.mp3',
    tournament: '/audio/music-tournament.mp3'
} as const;

export type Sfx = keyof typeof SFX;
export type Track = keyof typeof MUSIC;

const KEY = 'cc_audio';
type Prefs = { music: boolean; sfx: boolean; musicVol: number; sfxVol: number };
const DEFAULTS: Prefs = { music: true, sfx: true, musicVol: 0.25, sfxVol: 0.7 };

const load = (): Prefs => {
    try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) ?? '{}') }; }
    catch { return DEFAULTS; }
};

let prefs = load();
let current: HTMLAudioElement | null = null;
let currentTrack: Track | null = null;

export const getAudioPrefs = () => prefs;

export const setAudioPrefs = (p: Partial<Prefs>) => {
    prefs = { ...prefs, ...p };
    try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch { /* ignore */ }
    if (current) {
        current.volume = prefs.musicVol;
        if (!prefs.music) current.pause()
            else void current.play().catch(() => {});
    }
};

export const playSfx = (name: Sfx) => {
    if(!prefs.sfx) return;
    const a = new Audio(SFX[name]);
    a.volume = prefs.sfxVol;
    void a.play().catch(() => {});
};

export const playMusic = (track: Track) => {
    if (currentTrack === track) return;
    stopMusic();
    const a = new Audio(MUSIC[track]);
    a.loop = true;
    a.volume = prefs.musicVol;
    current = a;
    currentTrack = track;
    if (!prefs.music) return;
    // browser block autoplay until click, so retry on first interaction
    a.play().catch(() => {
        window.addEventListener('pointerdown', () => {
            if (current === a && prefs.music) void a.play().catch(() => {});
        }, { once: true });
    });
};

export const stopMusic = () => {
    current?.pause();
    current = null;
    currentTrack = null;
};