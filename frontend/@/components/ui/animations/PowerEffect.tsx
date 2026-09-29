import { useEffect, useMemo, useState } from "react";
import { secureRandom } from "./Starfield";
import { Bug, Eraser, EyeOff, Heart, HeartCrack, Hourglass, Lightbulb, ShieldAlert, Timer, Zap, type LucideIcon } from "lucide-react";

type PowerConf = {
    kind: 'powerup' | 'powerdown';
    label: string;
    icon: LucideIcon;
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
        label: 'Sheild',
        icon: ShieldAlert
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

const DUR_MS = 1400;
const COUNT = 14;

type PowerEffectProps = {
    effect: string | null;
    trigger: number;
}

const PowerEffect = ({effect, trigger}: PowerEffectProps) => {
    const [active, setActive] = useState<string | null>(null);

    useEffect(() => {
        if (trigger === 0 || !effect || !POWER_EFFECTS[effect]) {
            return;
        }
        setActive(effect);
        const timer = setTimeout(() => setActive(null), DUR_MS);
        
        return () => clearTimeout(timer);
    }, [trigger, effect])

    const particles = useMemo (
        () => Array.from({length: COUNT}, (_, i) => ({
            id: 1,
            dx: (secureRandom() - 0.5) * 320,
            delay: secureRandom() * 0.25,
            size: 4 + secureRandom() *6
        })),
        [trigger]
    )

    if (!active) {
        return null;
    }
}