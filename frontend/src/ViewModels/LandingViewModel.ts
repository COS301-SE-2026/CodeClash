import { useState, useEffect } from "react";

import {stats, steps, features, players, audience} from '../Models/LandingModel';
import type { Stat, Step, Feature, PlayerProgress,} from '../Models/LandingModel';

export interface LandingVIewModelProps {
    scrollY: number;
    stats: Stat[];
    steps: Step[];
    features: Feature[];
    audience: string[];
    players: PlayerProgress[];
}