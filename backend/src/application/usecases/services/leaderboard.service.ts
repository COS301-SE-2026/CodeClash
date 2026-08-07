import { PaginatedLeaderboardResponse } from "../../../entities/dtos/leaderboard.dto";
import { IEloRepository } from "../../interfaces/IEloRepository";
import { RankDTO } from "src/entities/dtos/rank.dto";

export class LeaderboardSystem {
    constructor(private readonly eloRepository: IEloRepository) {}

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