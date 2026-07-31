export interface LeaderboardUserProps{
    avatarUrl: string;
    username: string;
    elo: number;
}

export const LeaderboardUserData : LeaderboardUserProps = {
    avatarUrl: '../assets/Icons/profile_black.png',
    username: 'Username',
    elo: 0,
    // rating: 0,
}


export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  league: string;
  avatarUrl: string;
  username: string;
  elo: number;
  rating: number;
}

export interface PaginatedLeaderboardResponse {
  data: LeaderboardEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export async function fetchLeaderboard(limit: number, page: number): Promise<PaginatedLeaderboardResponse> {
  const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/elo/leaderboard?limit=${limit}&page=${page}`);
  if (!response.ok) throw new Error('Failed to fetch leaderboard')
  return await response.json();
}
