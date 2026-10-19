import lifeLost from 'src/assets/Audio/life-lost.ogg';
import powerup from 'src/assets/Audio/powerup.mp3';
import powerdown from 'src/assets/Audio/powerdown.mp3';
import achievement from 'src/assets/Audio/achievement.wav';
import notification from 'src/assets/Audio/notification.wav';
import musicMatch from 'src/assets/Audio/music-match.mp3';
import musicTournament from 'src/assets/Audio/music-tournament.ogg';
import purchase from 'src/assets/Audio/purchase.mp3';
import matchComplete from 'src/assets/Audio/match_complete.mp3';
import rankUp from 'src/assets/Audio/rank-up.mp3';
import rankDown from 'src/assets/Audio/rank-down.mp3';

const SFX = {
    life_lost: lifeLost,
    powerup,
    powerdown,
    achievement,
    notification,
    purchase,
    match_complete: matchComplete,
    rank_up: rankUp,
    rank_down: rankDown
} as const;

const MUSIC = {
    match: musicMatch,
    tournament: musicTournament
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