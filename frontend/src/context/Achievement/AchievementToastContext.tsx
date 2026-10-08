import React, { createContext, useCallback, useContext, useState, useEffect, useRef } from "react";
import { AchievementToast } from "src/context/Achievement/AchievementToast";
import type { Icons } from "src/Models/AchievementsModel";
import { getIcon } from "src/utils/achievementIcon";

import { useAuth } from "../Auth/hooks/useAuth";
import { FriendRequestToast } from "./FriendRequestToast";

interface ToastData {
    name: string;
    description: string;
    icon: Icons;
}

interface AchievementToastContextValue {
    showAchievement: (data: ToastData) => void;
    showFriendNotice: (primary:string, title?: string, secondary?: string) => void;
}

interface FriendToastData {
    title: string;
    primary: string;
    secondary?: string;
}

const AchievementToastContext = createContext<AchievementToastContextValue | null>(null);

export const useAchievementToast = () => {
    const ctx = useContext(AchievementToastContext);
    if (!ctx) throw new Error('useAchievementToast must be used withing AchievementToastProvider');
    return ctx;
};

export const AchievementToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<ToastData[]>([]);
    const { token } = useAuth();
    const prevEarnedIds = useRef<Set<string>>(new Set());
    const isFirstFetch = useRef(true);

    const [friendToastQueue, setFriendToastQueue] = useState<FriendToastData[]>([]);
     
    const showAchievement = useCallback((data: ToastData) => {
        setQueue(prev => [...prev, data]);
    }, []);

    const showFriendNotice = useCallback((primary: string, title: string = 'Friends', secondary?: string) => {
        setFriendToastQueue(prev => [...prev, { title, primary, secondary }]);
    }, []);

    useEffect(() => {
        if (!token) return;
       
        const checkAchievements = async () => {
            try {
                const res = await fetch('/api/achievements/me', {
                    headers: { Authorization: `Bearer ${token}`}
                });
                if (!res.ok) return;
                const data = await res.json();

                if (isFirstFetch.current) {
                    prevEarnedIds.current = new Set(data.map((a: any) => a.achievement_id));
                    isFirstFetch.current = false;
                    return;
                }

                const newlyEarned = data.filter((a: any) => !prevEarnedIds.current.has(a.achievement_id));
                for (const a of newlyEarned) {
                    showAchievement({ name: a.achievement_name, description: a.description, icon:getIcon(a.achievement_name) });
                }
                prevEarnedIds.current = new Set(data.map((a: any) => a.achievement_id));
            }catch (err) {
                console.error('Error checking achievements:', err);
            }
        };
        checkAchievements();
        const interval = setInterval(checkAchievements, 30_000); // poll every 30s
        return () => clearInterval(interval);
    }, [token, showAchievement]);

    const dismiss =useCallback(() => {
        setQueue(prev => prev.slice(1));
    }, []);

    const dismissFriendToast = useCallback(() => {
        setFriendToastQueue(prev => prev.slice(1));
    }, []);

    return(
        <AchievementToastContext.Provider value={{ showAchievement, showFriendNotice }}>
            {children}
            {queue[0] && (
                <AchievementToast
                    key={queue[0].name}
                    name={queue[0].name}
                    description={queue[0].description}
                    icon={queue[0].icon}
                    onDismiss={dismiss}
                />
            )}
            {friendToastQueue[0] && (
                <FriendRequestToast
                    key={friendToastQueue[0].title + friendToastQueue[0].primary}
                    title={friendToastQueue[0].title}
                    primary={friendToastQueue[0].primary}
                    secondary={friendToastQueue[0].secondary}
                    onDismiss={dismissFriendToast}
                />
            )}
        </AchievementToastContext.Provider>
    );
};

