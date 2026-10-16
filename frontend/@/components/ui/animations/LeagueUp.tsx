import { act, useEffect, useMemo, useState } from "react"
import { secureRandom } from "./Starfield"

import mercury from "../../../../src/assets/Planets/Mercury.jpg";
import venus from "../../../../src/assets/Planets/Venus.jpg";
import earth from "../../../../src/assets/Planets/Earth.jpg";
import mars from "../../../../src/assets/Planets/Mars.jpg";
import jupiter from "../../../../src/assets/Planets/Jupiter.jpg";
import saturn from "../../../../src/assets/Planets/Saturn.jpg";
import uranus from "../../../../src/assets/Planets/Uranus.jpg";
import neptune from "../../../../src/assets/Planets/Neptune.jpg";

type LeagueConf = {
    label: string;
    image: string;
    color: string;
}

export const LEAGUES: Record<string, LeagueConf> = {
    mercury: {
        label: 'Mercury',
        image: mercury,
        color: 'var(--primary)'
    },
    venus: {
        label: 'Venus',
        image: venus,
        color: 'var(--primary)'
    },
    earth: {
        label: 'Earth',
        image: earth,
        color: 'var(--primary)'
    },
    mars: {
        label: 'Mars',
        image: mars,
        color: 'var(--primary)'
    },
    jupiter: {
        label: 'Jupiter',
        image: jupiter,
        color: 'var(--primary)'
    },
    saturn: {
        label: 'Saturn',
        image: saturn,
        color: 'var(--primary)'
    },
    uranus: {
        label: 'Uranus',
        image: uranus,
        color: 'var(--primary)'
    },
    neptune: {
        label: 'Neptune',
        image: neptune,
        color: 'var(--primary)'
    },
}

const SHOW_MS = 4500;
const LEAVE_MS = 400;
const SPARKS = 24;

type LeagueUpProps = {
    league: string | null;
    trigger: number;
}

const LeagueUp = ({league, trigger}: LeagueUpProps) => {
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
            return {
                id: i,
                dx: Math.cos(angle) * dist,
                dy: Math.sin(angle) * dist,
                delay: 0.35 + secureRandom() *0.25,
                size: 4 + secureRandom() * 6
            }
        }), [trigger]
    )

    if (!active) {
        return null;
    }

    const {
        label, image, color
    } = LEAGUES[active];

    const close = () => {
        setLeaving(true);
        setTimeout(() => setActive(null), LEAVE_MS);
    }
}