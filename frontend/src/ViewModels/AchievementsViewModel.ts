import { useEffect, useState } from "react";
import { achievementContent } from "src/Models/AchievementsModel";
import type { Achievements, AchievementsContent, Earned } from "src/Models/AchievementsModel";

//This system needs an api and integration, so I am using mock data

const MOCK_ACHIEVEMENTS: Achievements[] = [
    {
        id: 'Ach1',
        name: 'Ach1 Name',
        description: 'Ach1 description - what does this badge do and how it was earned...',
        icon: 'trophy'
    },
    {
        id: 'Ach2',
        name: 'Ach2 Name',
        description: 'Ach2 description - what does this badge do and how it was earned...',
        icon: 'flame'
    },
    {
        id: 'Ach3',
        name: 'Ach3 Name',
        description: 'Ach3 description - what does this badge do and how it was earned...',
        icon: 'zap'
    },
    {
        id: 'Ach4',
        name: 'Ach4 Name',
        description: 'Ach4 description - what does this badge do and how it was earned...',
        icon: 'medal'
    }
]

const MOCKED_EARNED: Earned[] = [
    {
        id: 'AchEarned1',
        earnedAt: new Date(Date.now() - 1000 * 60 * 60 *24 * 20).toISOString()
    },
    {
        id: 'AchEarned2',
        earnedAt: new Date(Date.now() - 1000 * 60 * 60 *24 * 6).toISOString()
    }
]

interface AchievementsViewModel {
    content: AchievementsContent;
    isLoading: boolean;
    earned: (Achievements & {earnedAt: string})[];
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
}