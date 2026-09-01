import { PaginatedLeaderboardResponse } from "src/interface-adapters/dtos/leaderboard.dto";
import { IEloRepository } from "src/application/interfaces/IEloRepository";
import { RankDTO } from "src/interface-adapters/dtos/rank.dto";

export class LeaderboardService {
    constructor(private eloRepository: IEloRepository) {}

    async execute(limit: number, page: number): Promise<PaginatedLeaderboardResponse> {
      // const offset = (page - 1) * limit;
      // const { data, total } = await this.eloRepository.getLeaderboard(limit, offset);
      const offset = (page - 1) * limit;
      const { data, total } = await this.eloRepository.getLeaderboard(limit, offset);
      return {
        // data: data.map((entry, index) => ({ ...entry, rank: offset + index + 1 })),
        // total,
        // page,
        // pageSize: limit,\
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
      return this.eloRepository.getUserRank(userId);
    }



}