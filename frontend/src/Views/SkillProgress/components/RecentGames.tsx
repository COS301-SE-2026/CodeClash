import type React from 'react';
import type { GameMastery, MatchOutcome } from 'src/Models/SkillProgressModel';

interface RecentGamesProps {
    games: GameMastery[];
    ceiling: number;
}

const RESULT_BADGE: Record<MatchOutcome, string> = {
    WIN: 'badge-status-correct',
    LOSS: 'badge-status-wrong',
    DRAW: 'badge-status-pending'
};

const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

const RecentGames: React.FC<RecentGamesProps> = ({ games, ceiling }) => {
    if (games.length === 0) {
        return <p className="text-xsm text-muted-text">No games on record yet.</p>;
    }

    return (
        <div className="flex flex-col gap-2">
            {games.map(game => {
                const percentage = ceiling === 0 ? 0 : Math.min(100, (game.mastery / ceiling) * 100);
                return (
                    <div
                        key={game.matchId}
                        className="flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-3"
                    >
                        <div className="w-14 shrink-0">
                            <p className="text-xsm text-primary-text font-semibold">{formatDate(game.playedAt)}</p>
                            <p className="text-xsm text-muted-text capitalize">{game.domain}</p>
                        </div>

                        <span className={`badge ${RESULT_BADGE[game.result]}`}>{game.result}</span>

                        <div className="flex-1 min-w-[80px]">
                            <div className="progress-track">
                                <div className="progress-fill" style={{ width: `${percentage}%` }} />
                            </div>
                        </div>

                        <div className="text-right shrink-0">
                            <p className="text-xsm font-bold text-primary-text">{game.mastery.toFixed(2)}</p>
                            <p className="text-xsm text-muted-text">avg d{game.averageDifficulty.toFixed(1)}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RecentGames;