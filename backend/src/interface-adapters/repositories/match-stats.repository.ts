import { Repository } from "typeorm";
import { MatchStats } from "src/entities/db-entities/match-stats.entities";
import { IMatchStatsRepository } from "src/application/interfaces/repositories/IMatchStatsRepository";

export class MatchStatsRepository implements IMatchStatsRepository {
    constructor (private readonly matchStatsRepo: Repository<MatchStats>){}

    async saveStats(db_match_id: string, user_id: string, num_correct: number, total_time: number): Promise<void> {
        await this.matchStatsRepo.save(this.matchStatsRepo.create({
            match: { db_match_id } as any,
            user: { user_id } as any,
            num_correct,
            total_time
        }));
    }

    async getStatsByMatch(match_id: string): Promise<{ user_id: string; num_correct: number; total_time: number; }[]> {
        const stats = await this.matchStatsRepo.find({
            where: { match: { match_id } },
            relations: { user: true }
        });
        return stats.map(s=> ({
          user_id: s.user.user_id,
          num_correct: s.num_correct,
          total_time: s.total_time  
        }));
    }

    async getStatsByMatchAndUser(match_id: string, user_id: string): Promise<{ num_correct: number; total_time: number; } | null> {
        const stat = await this.matchStatsRepo.findOne({
            where: { match: { match_id }, user: { user_id } }
        });
        //TODO  catch the null
        if(!stat) return null;

        return { num_correct: stat.num_correct, total_time: stat.total_time };
    }
}