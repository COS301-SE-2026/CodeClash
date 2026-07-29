import { LeaderboardEntryDTO } from "@/application/dtos/LeaderboardEntryDTO";
import { IEloRepository } from "@/application/interfaces/IEloRepository";

export class LeaderboardSystem {
    constructor(private eloRepository: IEloRepository) {}
    
    async execute(limit?: number): Promise<LeaderboardEntryDTO[]> {
      const entries = await this.eloRepository.getLeaderboard(limit)
      return entries.map((entry, index) =>
        ({ ...entry, rank: index + 1 }))
    }
}