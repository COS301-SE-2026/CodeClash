import LeaderboardRow from './LeaderboardRow';
import type { LeaderboardUserProps } from 'src/Models/LeaderboardModel'

type LeaderboardTableProps = {
    rows: LeaderboardUserProps[];
    startRank: number;
};

const LeaderboardTable = ({ rows, startRank }: LeaderboardTableProps) => (
    <div className="card-elevated p-5">
        <div className="flex items-center gap-4 px-4 pb-2 text-xsm uppercase tracking-wide text-muted font-bold">

            <span className="w-8 text-center">#</span>
            <span className="w-9 shrink-0" />
            <span className="flex-1">Name</span>
            <span>Elo</span>
        </div>

        <div className="flex flex-col gap-2">
            {rows.map((user, idx) => (
                <LeaderboardRow key={user.username} rank={startRank + idx} user={user} />
            ))}
        </div>
    </div>
);

export default LeaderboardTable;