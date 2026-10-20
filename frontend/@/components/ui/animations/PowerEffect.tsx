import { useEffect, useMemo, useRef, useState } from "react";
import { secureRandom } from "./Starfield";
import { Bug, Eraser, EyeOff, Heart, HeartCrack, Hourglass, Lightbulb, ShieldAlert, Timer, Zap, type LucideIcon } from "lucide-react";

type PowerConf = {
    kind: 'powerup' | 'powerdown';
    label: string;
    icon: LucideIcon;
    persistent?: boolean;
}

export const POWER_EFFECTS: Record<string, PowerConf> = {
    reduce_time: {
        kind: 'powerup',
        label: 'Time Boost',
        icon: Timer
    },
    reveal_hint: {
        kind: 'powerup',
        label: 'Hint',
        icon: Lightbulb
    },
    block_next_powerdown: {
        kind: 'powerup',
        label: 'Shield',
        icon: ShieldAlert,
        persistent: true
    },
    score_multiplier:{
        kind: 'powerup',
        label: 'Score Surge',
        icon: Zap
    },
    restore_life: {
        kind: 'powerup',
        label: 'Second Wind',
        icon: Heart
    },
    insert_bugs: {
        kind: 'powerdown',
        label: 'Bug Injection',
        icon: Bug
    },
    wipe_answer: {
        kind: 'powerdown',
        label: 'Wipe',
        icon: Eraser
    },
    block_question: {
        kind: 'powerdown',
        label: 'Question Blackout',
        icon: EyeOff
    },
    increase_time: {
        kind: 'powerdown',
        label: 'Time Sink',
        icon: Hourglass
    },
    drain_life: {
        kind: 'powerdown',
        label: 'Life Drain',
        icon: HeartCrack
    },
}

export type Owner = 'me' | 'opponent';

export const getTarget = (effect: string, usedByMe: boolean, myName: string, opponentName: string) => {
    const kind = POWER_EFFECTS[effect]?.kind;
    const targetIsMe = kind === 'powerup' ? usedByMe : !usedByMe;
    return targetIsMe ? myName : opponentName;
}

const DUR_MS = 1400;
const COUNT = 14;
const PULSE_MS = 1000;
const FLY_AT_MS = 750;
const FLY_MS = 750;

type PowerEffectProps = {
    effect: string | null;
    trigger: number;
    username?: string;
    owner?: Owner;
    onSettled?: (effect: string, owner: Owner) => void;
}

const PowerEffect = ({effect, trigger, username, owner = 'me', onSettled}: PowerEffectProps) => {
    const [active, setActive] = useState<string | null>(null);
    const flyRef = useRef<HTMLSpanElement | null>(null);
    const iconRef = useRef<SVGSVGElement | null>(null);

    const ownerRef = useRef(owner);
    const settledRef = useRef(onSettled);
    ownerRef.current = owner;
    settledRef.current = onSettled;

    useEffect(() => {
        if (trigger === 0 || !effect || !POWER_EFFECTS[effect]) {
            return;
        }
        setActive(effect);
        const timer: number[] = [];
        let anim: Animation | undefined;

        if (!POWER_EFFECTS[effect].persistent) {
            timer.push(window.setTimeout(() => setActive(null), DUR_MS));
        }
        else {
            const settle = () => settledRef.current?.(effect, ownerRef.current);
            timer.push(window.setTimeout(() => {
                const fly = flyRef.current;
                const anchor = document.querySelector<HTMLElement>(`[data-shield-anchor="${ownerRef.current}"]`);
                const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

                if (!fly || !anchor || reduce) {
                    settle();
                    return;
                }

                const start = iconRef.current?.getBoundingClientRect();
                const sx = start ? start.left + start.width / 2 : window.innerWidth /2;
                const sy = start ? start.top + start.height / 2 : window.innerHeight /2;

                const end = anchor.getBoundingClientRect();
                const ex = end.left + end.width / 2;
                const ey = end.top + end.height / 2;
                const scale = end.width / fly.offsetWidth;

                const from = `translate(${sx}px, ${sy}px) translate(-50%, -50%) scale(1)`;
                const to = `translate(${ex}px, ${ey}px) translate(-50%, -50%) scale(${scale})`;

                anim = fly.animate(
                    [
                        {
                            transform: from,
                            opacity: 0,
                            offset: 0,
                        },
                        {
                            transform: from,
                            opacity: 1,
                            offset: 0.12,
                        },
                        {
                            transform: to,
                            opacity: 1,
                            offset: 1,
                        }
                    ],
                    {
                        duration: FLY_MS,
                        easing: 'ease-in-out',
                        fill: 'forwards'
                    }
                )
                anim.onfinish = settle;
            }, FLY_AT_MS))
            timer.push(window.setTimeout(() => setActive(null), FLY_AT_MS + FLY_MS + 60));
        }
        
        return () => {
            timer.forEach(clearTimeout);
            anim?.cancel();
        }
    }, [trigger, effect])

    const particles = useMemo (
        () => Array.from({length: COUNT}, (_, i) => ({
            id: i,
            dx: (secureRandom() - 0.5) * 320,
            delay: secureRandom() * 0.25,
            size: 4 + secureRandom() *6
        })),
        [trigger]
    )

    if (!active) {
        return null;
    }

    const {kind, label, icon: Icon, persistent} = POWER_EFFECTS[active];

    return (
        <div key={trigger} className={`power-effect ${kind === 'powerup' ? 'power-up' : 'power-down'}`} aria-hidden="true" style={persistent ? {['--power-duration' as string]: `${PULSE_MS}ms`}: undefined}>
            <div className="power"/>
            <div className="power-center">
                <span className="power-ring"/>
                <span className="power-ring" style={{animationDelay: '0.15s'}}/>
                {particles.map((p) => (
                    <span key={p.id} className="power-particle" style={{width: p.size, height: p.size,animationDelay: `${p.delay}s`, ['--dx' as string]: `${p.dx}px`}}/>
                ))}
                <div className="power-badge">
                    <Icon ref={iconRef} className="power-icon" strokeWidth={2.2}/>
                    <p className="power-label">{label}</p>
                    {username && <p className="power-user">for {username}</p>}
                </div>
            </div>

            {persistent && (
                <span ref={flyRef} className="power-fly">
                    <Icon strokeWidth={2.2}/>
                </span>
            )}
        </div>
    )
}

export default PowerEffect;

export const ShieldIndicator = ({owner, active}: {owner: Owner; active: boolean}) => {
    const Icon = POWER_EFFECTS.block_next_powerdown.icon;
    return (
        <span data-shield-anchor={owner} className={`shield-indicator ${active ? 'shield-on' : ''}`} title="Shield active">
            <Icon strokeWidth={2.2}/>
        </span>
    )
}