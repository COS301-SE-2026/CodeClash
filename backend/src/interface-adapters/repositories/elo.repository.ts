import { IEloRepository } from "src/application/interfaces/repositories/IEloRepository";
import { Repository } from "typeorm";
import { EloHistory} from "src/entities/database/elo.entities";
import { EloDTO, EloUpdateResultDTO } from "src/entities/dtos/users/elo.dto";
import { AppDataSource } from "src/frameworks-drivers/config/data-source";

import { LeaderboardEntryDTO } from "src/entities/dtos/match/leaderboard.dto";
import { RankDTO } from "src/entities/dtos/users/rank.dto";

const K_FACTOR = 32

export class EloRepository implements IEloRepository {
    constructor(
        private readonly eloRepository: Repository<EloRatings>
    ) { }
    private readonly historyRepo: Repository<EloHistory> = AppDataSource.getRepository(EloHistory);

    async createUserElo(user_id: string): Promise<void> {

        await this.eloRepository.save({
            rating: 600,
            user: {
                user_id: user_id
            }
        })

    }

    async getElo(user_id: string): Promise<EloDTO | null> {
        const elo = await this.eloRepository.findOne({
            where: { user: { user_id: user_id } },

        })


        if (!elo) return null;

        const data: EloDTO = {
            rating: elo.rating
        }
        return data;
    }

    async getUsersElo(user_ids: string[]): Promise<EloDTO[] | null> {

        const elos: EloDTO[] | null = []

        for (const id of user_ids) {
            const elo = await this.eloRepository.findOne({
                where: { user: { cognito_id: id } },
                relations: {
                    user: true
                }
            })

            if (elo) {
                const data: EloDTO = {
                    user_id: elo.user.user_id,
                    rating: elo.rating
                }
                elos.push(data)
            }
        }

        if (elos.length === 0) return null

        return elos;

    }

    

    
    async getUserRank(userId: string): Promise<RankDTO | null> {

      const row = await this.eloRepository.findOne({
        where: { user: { user_id: userId } },
        relations: { user: true }
        
      })
      
      if (!row) return null;
      
      const ahead = await this.eloRepository
        .createQueryBuilder('elo')
        .innerJoin('elo.user', 'user')
        .where('elo.rating > :rating', { rating: row.rating })
        .orWhere('elo.rating = :rating AND user.username < :username',
        { rating: row.rating, username: row.user.username })
        .getCount()

        const data : RankDTO = {
        user_id: userId,
        rank: ahead + 1
      };

        return data;
        
    }
}

