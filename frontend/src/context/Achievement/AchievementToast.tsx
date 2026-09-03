import React, { useEffect, useState } from "react";
import { Trophy, Flame, Zap, Medal } from "lucide-react";
import type { Icons } from "src/Models/AchievementsModel";

const AchIcons: Record<Icons, React.ComponentType<{ size?: number; className?: string }>> = {
    trophy: Trophy, flame: Flame, zap: Zap, medal: Medal
};

interface AchievementToastProps {
    name: string;
    description: string;
    icon: Icons;
    onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ name, description, icon, onDismiss}) => {
    const [visible, setVisible] =useState(false);
    const Icon = AchIcons[icon];

    useEffect(() => {
        // fade in
        const show = requestAnimationFrame(() => setVisible(true));
        // auto dismiss after 4s
        const dismiss = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
        }, 4000);

        return () => {
            cancelAnimationFrame(show);
            clearTimeout(dismiss);
        };
    }, [onDismiss]);

    return (
        <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="card-glow p-4 flex items-center gap-4 min-w-[280px] max-w-[340px] cursor-pointer" onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}>
                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-primary"/>
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-xsm text-primary font-bold uppercase tracking-wide">Achievement Unlocked!</p>
                    <p className="text-primary-text font-bold truncate">{name}</p>
                    <p className="text-xsm text-muted truncate">{description}</p>
                </div>
            </div>
        </div>
    );
};