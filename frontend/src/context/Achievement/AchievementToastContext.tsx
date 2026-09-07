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
    showFriendRequest: (username:string) => void;
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

    const [friendRequestQueue, setFriendRequestQueue] = useState<string[]>([]);
    const prevRequestIds =  useRef<Set<string>>(new Set());
    const isFriendFirstFetch = useRef(true);
     
    const showAchievement = useCallback((data: ToastData) => {
        setQueue(prev => [...prev, data]);
    }, []);

    const showFriendRequest = useCallback((username: string) => {
        setFriendRequestQueue(prev => [...prev, username]);
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

    useEffect(() => {
        if (!token) return;

        const checkFriendRequests = async () => {
            try {
                const res = await fetch('api/friends/requests?type=received', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                console.log('friend requests polled:', data); // ← add this
                console.log('prev ids:', prevRequestIds.current);

                if(isFriendFirstFetch.current) {
                    prevRequestIds.current = new Set(data.map((r: any) => r.friendship_id));
                    isFriendFirstFetch.current = false;
                    return;
                }

                const newRequests = data.filter((r: any) => !prevRequestIds.current.has(r.friendship_id));
                for (const r of newRequests){
                    showFriendRequest(r.username);
                }
                prevRequestIds.current = new Set(data.map((r: any) => r.friendship_id));
            } catch (err) {
                console.error('Error checking friend requests:', err);
            }
        };

        checkFriendRequests();
        const interval = setInterval(checkFriendRequests, 30_000);
        return () => clearInterval(interval);
    }, [token, showFriendRequest]);

    const dismissFriendRequest = useCallback(() => {
        setFriendRequestQueue(prev => prev.slice(1));
    }, []);

    return(
        <AchievementToastContext.Provider value={{ showAchievement, showFriendRequest }}>
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
            {friendRequestQueue[0] && (
                <FriendRequestToast
                    key={friendRequestQueue[0]}
                    username={friendRequestQueue[0]}
                    onDismiss={dismissFriendRequest}
                />
            )}
        </AchievementToastContext.Provider>
    );
};

