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

