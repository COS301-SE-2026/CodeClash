import { useEffect, useState, useRef } from "react";
import { useAchievementToast } from "src/context/Achievement/AchievementToastContext";
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { achievementContent } from "src/Models/AchievementsModel";
import type { Achievements, AchievementsContent } from "src/Models/AchievementsModel";
import { getIcon } from "src/utils/achievementIcon";

const API_BASE = '/api';

interface AchievementsViewModel {
    content: AchievementsContent;
    isLoading: boolean;
    earned: (Achievements & { earnedAt: string }) [];
    locked: Achievements[];
    totalNum: number;
    earnedNum: number;
}

export function AchievementsViewModelFunc(): AchievementsViewModel {
    const { token } = useAuth();
    const [isLoading, setIsloading] = useState(true);
    const [earned, setEarned] = useState<(Achievements & { earnedAt: string })[]>([]);
    const [locked, setLocked] = useState<Achievements[]>([]);
    const { showAchievement } = useAchievementToast();

    useEffect(() => {
        if(!token) return;

    const fetchAchievements = async() => {
        try{
            // fetch all achievements and user's earned achievements in parallel
            const [allRes, earnedRes] = await Promise.all([
                fetch(`${API_BASE}/achievements`, { headers: { Authorization: `Bearer ${token}` }}),
                fetch(`${API_BASE}/achievements/me`, { headers: { Authorization: `Bearer ${token}` }})
            ]);

            const allData = allRes.ok ? await allRes.json() : [];
            const earnedData = earnedRes.ok ? await earnedRes.json() : [];

            const earnedIds = new Set(earnedData.map((a: any) => a.achievement_id));
            const earnedList: (Achievements & { earnedAt: string })[] = earnedData.map((a:any) => ({
                id: a.achievement_id,
                name: a.achievement_name,
                description: a.description,
                icon: getIcon(a.achievement_name),
                earnedAt: a.earned_at ?? new Date().toISOString()
            })).sort((a: any, b: any) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime());

            const lockedList: Achievements[] = allData
            .filter((a: any) => !earnedIds.has(a.achievement_id))
            .map((a:any) => ({
                id: a.achievement_id,
                name: a.achievement_name,
                description: a.description,
                icon: getIcon(a.achievement_name)
            }));

            setEarned(earnedList);
            setLocked(lockedList);
        }catch(err){
            console.error('Error fetching achievements:', err);
        } finally {
            setIsloading(false);
        }
    };
    fetchAchievements();
}, [token, showAchievement]);

    return {
        content: achievementContent,
        isLoading,
        earned,
        locked,
        totalNum: earned.length + locked.length, 
        earnedNum: earned.length
    };
}