import React, { createContext, useCallback, useContext, useState } from "react";
import { AchievementToast } from "src/components/AchievementToast";
import type { Icons } from "src/Models/AchievementsModel";

interface ToastData {
    name: string;
    description: string;
    icon: Icons;
}

interface AchievementToastContextValue {
    showAchievement: (data: ToastData) => void;
}

const AchievementToastContext = createContext<AchievementToastContextValue | null>(null);

export const useAchievementToast = () => {
    const ctx = useContext(AchievementToastContext);
    if (!ctx) throw new Error('useAchievementToast must be used withing AchievementToastProvider');
    return ctx;
};

export const AchievementToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<ToastData[]>([]);

    const showAchievement = useCallback((data: ToastData) => {
        setQueue(prev => [...prev, data]);
    }, []);

    const dismiss =useCallback(() => {
        setQueue(prev => prev.slice(1));
    }, []);

    return(
        <AchievementToastContext.Provider value={{ showAchievement }}>
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
        </AchievementToastContext.Provider>
    );
};

