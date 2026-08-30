import { Trophy, Flame, Zap, Medal } from "lucide-react";
import React from "react";
import { AchievementsViewModelFunc } from "src/ViewModels/AchievementsViewModel";
import type { Icons } from "src/Models/AchievementsModel";
import Loading from "@/components/shared/Loading";
import Starfield from "@/components/ui/animations/Starfield";

//We can add the confetti animation when an achievement is unlocked

const AchIcons: Record<Icons, React.ComponentType<{size?: number; className?: string}>> = {
    trophy: Trophy,
    flame: Flame,
    zap: Zap,
    medal: Medal
}

function timeTracker(iso:string): string {
    const difference = Date.now() - new Date(iso).getTime();
    const days = Math.floor(difference/(1000* 60*60 *24));

    if (days ===0) {
        return 'Today';
    }
    if (days === 1) {
        return '1 day ago';
    }

    return `${days} days ago`;
}