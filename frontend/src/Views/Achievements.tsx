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

const Achievements: React.FC = () => {
    const {content, isLoading, earned, locked, totalNum, earnedNum} = AchievementsViewModelFunc();

    if (isLoading) {
        return <Loading isOpen={true}/>;
    }

    return (
        <div className="relative min-h-[100vh-80px] overflow-hidden">
            <Starfield count={30}/>
            <div className="relative z-10 max-w-xl items-center justify-center mx-auto flex flex-col gap-6">
                {/*Header */}
                <div className="flex flex-col items-center justify-center gap-2">
                    <div>
                        <h1 className="text-xl font-black text-primary-text mb-2">{content.title}</h1>
                        <div className="px-5 py-3 flex items-center justify-center gap-3 shrink-0">
                            <span className="score-display text-sm text-primary">{earnedNum/totalNum}</span>
                            <span className="text-xsm uppercase tracking-wide text-primary">{content.progressLabel}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Achievements;