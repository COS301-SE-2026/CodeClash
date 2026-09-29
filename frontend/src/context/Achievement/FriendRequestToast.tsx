import { UserPlus } from "lucide-react";
import React, { useEffect, useState } from "react";

interface FriendREquestToastProps {
    title: string;
    primary: string;
    secondary?: string;
    onDismiss: () => void;
}

export const  FriendRequestToast: React.FC<FriendREquestToastProps> = ({ title, primary, secondary, onDismiss }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const show = requestAnimationFrame(() => setVisible(true));
        const dismiss = setTimeout(() => {
            setVisible(false);
            setTimeout(onDismiss, 300);
        }, 5000);

        return () => {
            cancelAnimationFrame(show);
            clearTimeout(dismiss);
        };
    }, [onDismiss]);

    return (
        <div className={`fixed top-6 right-6 z-[100] transition-all duration-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <div
                className="card-glow p-4 flex items-center gap-4 min-w-[280px] max-w-[340px] cursor-pointer"
                onClick={() => { setVisible(false); setTimeout(onDismiss, 300); }}
            >
                <div className="w-12 h-12 rounded-full border-2 border-secondary flex items-center justify-center shrink-0">
                    <UserPlus size={22} className="text-secondary"/>
                    
                </div>
                <div className="flex flex-col min-w-0">
                    <p className="text-xsm text-secondary font-bold uppercase tracking-wide">{title}</p>
                    <p className="text-primary-text font-bold truncate">{primary}</p>
                    {secondary && <p className="text-xsm text-muted">{secondary}</p>}
                </div>
            </div>
        </div>
    );
};