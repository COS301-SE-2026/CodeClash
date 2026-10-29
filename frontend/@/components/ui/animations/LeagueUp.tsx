import { useEffect, useMemo, useState } from "react"
import { secureRandom } from "./Starfield"

import mercury from "../../../../src/assets/Planets/Mercury.png";
import venus from "../../../../src/assets/Planets/Venus.png";
import earth from "../../../../src/assets/Planets/Earth.png";
import mars from "../../../../src/assets/Planets/Mars.png";
import jupiter from "../../../../src/assets/Planets/Jupiter.png";
import saturn from "../../../../src/assets/Planets/Saturn.png";
import uranus from "../../../../src/assets/Planets/Uranus.png";
import neptune from "../../../../src/assets/Planets/Neptune.png";

type LeagueConf = {
    label: string;
    image: string;
}

export const LEAGUES: Record<string, LeagueConf> = {
    mercury: {
        label: 'Mercury',
        image: mercury,

    },
    venus: {
        label: 'Venus',
        image: venus,

    },
    earth: {
        label: 'Earth',
        image: earth,

    },
    mars: {
        label: 'Mars',
        image: mars,

    },
    jupiter: {
        label: 'Jupiter',
        image: jupiter,

    },
    saturn: {
        label: 'Saturn',
        image: saturn,

    },
    uranus: {
        label: 'Uranus',
        image: uranus,

    },
    neptune: {
        label: 'Neptune',
        image: neptune,

    },
}

const SHOW_MS = 4500;
const LEAVE_MS = 400;
const SPARKS = 24;

type Direction = 'up' | 'down';

const LABELS: Record<Direction, {title: string; line: string}> = {
    up: {
        title: 'Congratulations!',
        line: 'You have reached'
    },
    down: {
        title: 'Oh no!',
        line: 'You have dropped to'
    }
}

type LeagueProps = {
    league: string | null;
    trigger: number;
    children?: void;
}

type LeagueBaseProps = LeagueProps & {direction: Direction}

const LeagueBase = ({league, trigger, children, direction}: LeagueBaseProps) => {
    const [active, setActive] = useState<string | null>(null);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        const key = league?.toLowerCase();
        if (trigger === 0 || !key || !LEAGUES[key]) {
            return;
        }
        setActive(key);
        setLeaving(false);

        const leave = setTimeout(() => setLeaving(true), SHOW_MS - LEAVE_MS);
        const done = setTimeout(() => setActive(null), SHOW_MS);

        return () => {
            clearTimeout(leave);
            clearTimeout(done);
        }
    }, [trigger, league])

    const sparks = useMemo(
        () => Array.from({length: SPARKS}, (_, i) => {
            const angle = (i/SPARKS) * Math.PI * 2 + secureRandom() * 0.4;
            const dist = 140 + secureRandom() * 120;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist;
            return {
                id: i,
                dx: direction === 'down' ? dx * 0.6 : dx,
                dy: direction === 'down' ? Math.abs(dy) + 40: dy,
                delay: 0.35 + secureRandom() *0.25,
                size: 4 + secureRandom() * 6
            }
        }), [trigger, direction]
    )

    if (!active) {
        return null;
    }

    const {
        label, image
    } = LEAGUES[active];

    const accent = direction === 'down' ? 'var(--danger)' : 'var(--success)';
    const {
        title, line
    } = LABELS[direction];

    return (
        <div key={trigger} className={`league-up league-${direction} ${leaving ? 'leaving': ''} ${children}`} style={{['--league-color' as string]: accent}}
            role="status" aria-live="polite">
            <div className="league-stage">
                <div className="league-planet-wrap">
                    <span className="league-glow"/>
                    <span className="league-orbit"/>
                    {sparks.map((s) => (
                        <span key={s.id} className="league-spark" style={{width: s.size, height: s.size, animationDelay: `${s.delay}s`, ['--dx' as string]: `${s.dx}px`, ['--dy' as string]: `${s.dy}px`}}/>
                    ))}
                    <img src={image} alt={`${label} League`} className="league-img"/>
                </div>

                <h1 className="league-title">{title}</h1>
                <p className="league-name">{line} <strong>{label}</strong> League</p>
            </div>
            
        </div>
        
    )
}
const LeagueUp = (props: LeagueProps) => <LeagueBase {...props} direction="up"/>;
export const LeagueDown = (props: LeagueProps) => <LeagueBase {...props} direction="down"/>

export default LeagueUp;