import { PaginatedLeaderboardResponse } from "src/entities/dtos/leaderboard/leaderboard.dto";
import { IUserRepository } from "src/application/interfaces/repositories/IUserRepository";
import { RankDTO } from "src/entities/dtos/user/rank.dto";

export class LeaderboardService {
    constructor(private user_repo: IUserRepository) {}

    async execute(limit: number, page: number): Promise<PaginatedLeaderboardResponse> {
      const offset = (page - 1) * limit;
      const { data, total } = await this.user_repo.getLeaderboard(limit, offset);
      return {
        data: data.map((entry, index) => ({
          ...entry,
          rank: offset + index + 1,
          
        })),
        total,
        page,
        pageSize: limit,
      };
    }

    async getUserRank(userId: string): Promise<RankDTO | null>{
      return this.user_repo.getUserRank(userId);
    }

}