import { PaginatedLeaderboardResponse } from "src/interface-adapters/dtos/leaderboard.dto";
import { IEloRepository } from "../../interfaces/repositories/IEloRepository";

export class LeaderboardService {
    constructor(private eloRepository: IEloRepository) {}

    async execute(limit: number, page: number): Promise<PaginatedLeaderboardResponse> {
      const offset = (page - 1) * limit;
      const { data, total } = await this.eloRepository.getLeaderboard(limit, offset);
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
}