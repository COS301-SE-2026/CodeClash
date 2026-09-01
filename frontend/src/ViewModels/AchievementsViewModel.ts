import { useEffect, useState } from "react";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { achievementContent } from "src/Models/AchievementsModel";
import type { Achievements, AchievementsContent, Earned } from "src/Models/AchievementsModel";

const API_BASE = '/api';

// mapping achievement names to icons. More can be added
function getIcon(name:string): 'trophy' | 'flame' | 'zap' | 'medal' {
    const n = name.toLowerCase();
    if(n.includes('league') || n.includes('champion') || n.includes('legend') || n.includes('elite') || n.includes('challenger')) return 'trophy';
    if(n.includes('streak') || n.includes('roll') || n.includes('unstoppable') || n.includes('veteran') || n.includes('century')) return 'flame';
    if(n.includes('speed') || n.includes('shooter') || n.includes('blood') || n.includes('wizard') || n.includes('breaker')) return 'zap';
    return 'medal';
}

interface AchievementsViewModel {
    content: AchievementsContent;
    isLoading: boolean;
    earned: (Achievements & { earnedAt: string }) [];
    locked: Achievements[];
    totalNum: number;
    earnedNum: number;
}

export function AchievementsViewModelFunc(): AchievementsViewModel {
    const [isLoading, setIsloading] = useState(true);
    const [achievements, setAchievements] = useState<Achievements[]>([]);
    const [earnedRecord, setEarnedRecord] = useState<Earned[]>([]);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setAchievements(MOCK_ACHIEVEMENTS);
            setEarnedRecord(MOCKED_EARNED);
            setIsloading(false);
        }, 300);

        return () => clearTimeout(timeout);
    }, [])

    const earnedId = new Set(earnedRecord.map((r) => r.id));
    const earned = achievements.filter((a) => earnedId.has(a.id)).map((a) => ({
        ...a, earnedAt: earnedRecord.find((r) => r.id === a.id)!.earnedAt
    }))
    .sort((a,b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());

    const locked = achievements.filter((a) => !earnedId.has(a.id));

    return {
        content: achievementContent,
        isLoading,
        earned,
        locked,
        totalNum: achievements.length,
        earnedNum: earned.length
    }
}