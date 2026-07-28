import { useState, useEffect } from "react";

import {stats, steps, features, players, audience} from '../Models/LandingModel';
import type { Stat, Step, Feature, PlayerProgress,} from '../Models/LandingModel';

export interface LandingViewModelProps {
    scrollY: number;
    stats: Stat[];
    steps: Step[];
    features: Feature[];
    audience: string[];
    players: PlayerProgress[];
}

export const LandingViewModelFunction = (): LandingViewModelProps => {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        }

        window.addEventListener("scroll", handleScroll, {
            passive: true,
        })

        return () => {
            window.removeEventListener("scroll", handleScroll);
        }
    }, []);

    return {
        scrollY,

        stats,
        steps,
        features,
        audience,
        players,
    };
};