export interface LeaderboardUserProps{
    user_id: string;
    username: string;
    elo: number;
    avatar: string;
}

export const LeaderboardUserData : LeaderboardUserProps = {
    user_id: "id",
    username: 'Username',
    elo: 0,
    avatar: ""
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

