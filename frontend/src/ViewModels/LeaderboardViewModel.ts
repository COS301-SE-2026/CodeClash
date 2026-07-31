import { useState, useEffect, useCallback } from 'react'
// import type { LeaderboardUserProps } from 'src/Models/LeaderboardModel';
import { type PaginatedLeaderboardResponse, type LeaderboardUserProps } from 'src/Models/LeaderboardModel';


export async function fetchLeaderboard(limit: number, page: number): Promise<PaginatedLeaderboardResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}elo/leaderboard?limit=${limit}&page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard')
  return await response.json();
}

export function LeaderboardViewModel(league : string){
  const [userData, setUserData] = useState<LeaderboardUserProps[]>([]);
  const [topThree, setTopThree] = useState<LeaderboardUserProps[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

    const loadLeaderboard = useCallback(async (p: number) => { //useCallback is used so that returned data is cached until any values of the returned data is changed
        setIsLoadingData(true);
        setError(null);
        try{
            const response = await fetchLeaderboard(pageSize, p);
            // setUserData(response.data);
            // setTotalPages(Math.ceil(response.total / pageSize));
            const mapped: LeaderboardUserProps[] = response.data.map(entry => ({
                avatarUrl: '',
                username: entry.username,
              elo: entry.rating !== undefined ? entry.rating : 0,
            }));
            setUserData(mapped);
          setTotalPages(Math.max(1, Math.ceil(response.total / pageSize)));
          if (p === 1) {
            setTopThree(mapped.slice(0, 3));
          }
        }
        catch(err){
            setError(`Could not load User Data ${err}`);
        }
        finally{
            setIsLoadingData(false);
        }
    }, [league]);

    useEffect(() => {
        loadLeaderboard(page);
    }, [page, loadLeaderboard]);

  const nextPage = () => {
    if (page < totalPages) {
      setPage(p => p + 1);
    }
  }

  const prevPage = () => {
    if (page > 1) {
      setPage(p => p - 1);
    }
  }

  return {
    userData, topThree, isLoadingData, error, page, totalPages, setPage, nextPage, prevPage,
    refresh: () => loadLeaderboard(page)
  }


}
