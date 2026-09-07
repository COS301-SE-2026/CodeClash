import type { ReactElement } from 'react';
import { Crown, Medal } from 'lucide-react'
import type { LeaderboardUserProps } from 'src/Models/LeaderboardModel'

const RANK_STYLE: Record<1 | 2 | 3, { size: string; icon: ReactElement; order: string }> = {
    1: { size: 'w-[220px] py-8', icon: <Crown size={28} className="text-primary" />, order: 'order-2' },
    2: { size: 'w-[180px] py-6', icon: <Medal size={22} className="text-muted" />, order: 'order-1' },
    3: { size: 'w-[180px] py-6', icon: <Medal size={22} className="text-[#B36548]" />, order: 'order-3' },
};

type PodiumCardProps = {
    rank: 1 | 2 | 3;
    user: LeaderboardUserProps;
};

const PodiumCard = ({ rank, user }: PodiumCardProps) => {
    const { size, icon, order } = RANK_STYLE[rank];
    const initial = user.username?.[0]?.toUpperCase() ?? '-';

    return (
        <div className={`card-elevated flex flex-col items-center gap-2 px-4 ${size} ${order} ${rank === 1 ? 'card-glow' : ''}`}>
            {icon}
            <div className="avatar w-14 h-14 flex items-center justify-center text-lg font-black text-primary-text bg-background-elevated">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : initial}
            </div>
            <p className="text-md font-black text-primary-text truncate max-w-full px-2">{user.username}</p>
            <p className="score-display text-xl font-black">{user.elo}</p>
        </div>
    );
};

export default PodiumCard;