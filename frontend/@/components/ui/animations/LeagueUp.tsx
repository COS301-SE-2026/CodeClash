import { useEffect, useMemo, useState } from "react"
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