import type { LeaderboardUserProps } from 'src/Models/LeaderboardModel'

type LeaderboardRowProps = {
    rank: number;
    user: LeaderboardUserProps;
};

const LeaderboardRow = ({ rank, user }: LeaderboardRowProps) => {
    const initial = user.username?.[0]?.toUpperCase() ?? '-'

    return (
        <div className="flex items-center gap-4 rounded-2xl bg-background-elevated border border-border px-4 py-3">
            <span className="w-8 text-center text-sm font-black text-muted">{rank}</span>
            <div className="avatar w-9 h-9 flex items-center justify-center text-sm font-black text-primary-text bg-background-elevated shrink-0">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" /> : initial}
            </div>

            <span className="flex-1 text-sm font-semibold text-primary-text truncate">{user.username}</span>
                <span className="score-display text-md">{user.elo}</span>
        </div>
    );
};

export default LeaderboardRow;