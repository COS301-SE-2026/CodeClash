import { useEffect, useState } from "react"
import { useAuth } from "src/context/Auth/hooks/useAuth";
import { useMatchmaking } from "src/context/Socket/hooks/useMatchmaking";
import { useUser } from "src/context/User/hooks/useUser";
import type { GameType } from "src/dtos/matchmaking.dto";
import { getIcon } from "src/utils/achievementIcon";

export function useDashboardViewModel() {
    const [isOpen, setIsOpen] = useState(false);
    const {setGameType} = useMatchmaking();
    const {username, elo, avatar, league, current_streak, winning_streak, refresh} = useUser()
    const {isLoading, token} = useAuth()

    const [recentAchievement, setRecentAchievement] = useState<{
        name: string;
        description: string;
        icon: 'trophy' | 'flame' | 'zap' | 'medal';
        earnedAt: string;
    } | null>(null);

    useEffect(() => {
        if (!token) {
            return;
        }
        fetch('/api/achievements/me', { headers: { Authorization: `Bearer ${token}`}})
        .then(res => res.ok ? res.json() : [])
        .then((data: any[]) => {
            // sort by earned_at descending, take firs
            const sorted = [...data].sort((a, b) => 
            new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime() 
            );
            const latest = sorted[0];
            setRecentAchievement({
                name: latest.achievement_name,
                description: latest.description,
                icon: getIcon(latest.achievement_name),
                earnedAt: latest.earned_at
            });
        }).catch(() => {});
    }, [token]);

    const openPopUp = (type: GameType) => {
        setGameType(type)
        setIsOpen(true);
    }
    const closePopUp = () => {
        setIsOpen(false);
        setGameType(null)
    }

    return { 
        isOpen, 
        openPopUp, 
        closePopUp,
        username,
        elo,
        avatar,
        league,
        current_streak, winning_streak,
        recentAchievement,
        isLoading,
        refresh
    };
}

