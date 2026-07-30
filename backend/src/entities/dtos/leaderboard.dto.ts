export interface LeaderboardEntryDTO {
  rank: number;
  user_id: string;
  username: string
  avatar_id: number;
  rating: number;
  league: string;

}

export interface PaginatedLeaderboardResponse {
  data: LeaderboardEntryDTO[];
  total: number;
  page: number;
  pageSize: number;
}