import { Trophy } from 'lucide-react'

import { LeaderboardViewModel } from '../ViewModels/LeaderboardViewModel';

import PodiumCard from './Leaderboard/components/PodiumCard';
import LeaderboardTable from './Leaderboard/components/LeaderboardTable';
import Pagination from './Leaderboard/components/Pagination';
import Loading from '@/components/shared/Loading';
import Starfield from '@/components/ui/animations/Starfield';


const PLACEHOLDER = { username: '-', elo: 0, avatarUrl: ''};

const Leaderboard = () => {
  const { userData, topThree, isLoadingData, error, page, totalPages, setPage, nextPage, prevPage } = LeaderboardViewModel('earth');

  if (isLoadingData) return <Loading isOpen={isLoadingData} />

  const podium = [0, 1, 2].map(i => topThree[i] ?? PLACEHOLDER);
  const displayedRows = page === 1 ? userData.slice(3) : userData;
  const startRank = page === 1 ? 4 : (page - 1) * 10 + 1;

  console.log("Leaderboard page")

  return (
    <div className="relative w-full min-h-screen bg-cover bg-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background/85 via-background/75 to-background" />
      <Starfield />

      <div className="relative z-10 max-w-[1000px] mx-auto px-6 py-10">
        <div className="flex items-center justify-center gap-3 mb-10">
          <Trophy size={32} className="text-primary" />
          <h1 className="heading text-center">Leaderboard</h1>
        </div>

        {error ? (
          <div className="card-elevated p-6 text-center text-danger">{error}</div>
        ): (
          <div className="flex flex-col gap-8">
            <div className="flex items-end justify-center gap-4">
              <PodiumCard rank={2} user={podium[1]} />
              <PodiumCard rank={1} user={podium[0]} />
              <PodiumCard rank={3} user={podium[2]} />
            </div>

            <LeaderboardTable rows={displayedRows} startRank={startRank} />

            <Pagination page={page} totalPages={totalPages} onPrev={prevPage} onNext={nextPage} onPageSelect={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;

// testing husky stuff