import { LeaderboardEntryDTO } from "../../../entities/dtos/leaderboard.dto";
import { IEloRepository } from "../../interfaces/IEloRepository";

export class LeaderboardSystem {
    constructor(private eloRepository: IEloRepository) {}
    
    async execute(limit?: number): Promise<LeaderboardEntryDTO[]> {
      const entries = await this.eloRepository.getLeaderboard(limit)
      return entries.map((entry, index) =>
        ({ ...entry, rank: index + 1 }))
    }
}