import { IEloRepository } from "src/application/interfaces/IEloRepository";
import { EloRatings } from "src/entities/db-entities/elo.entities";
import { EloDTO } from "src/entities/dtos/elo.dto";
import { Repository } from "typeorm";

import { LeaderboardEntryDTO } from "../../entities/dtos/leaderboard.dto"
import { RankDTO } from "src/entities/dtos/rank.dto";


export class EloRepository implements IEloRepository {
    constructor(
        private readonly eloRepository: Repository<EloRatings>
    ) { }


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

    async getLeaderboard(limit: number, offset: number): Promise<{ data: LeaderboardEntryDTO[]; total: number }> {
      const [results, total] = await this.eloRepository
        .createQueryBuilder('elo')
        .innerJoinAndSelect('elo.user', 'user')
        .orderBy('elo.rating', 'DESC')
        .skip(offset)
        .take(limit)
        .getManyAndCount()

      return {
        data: results.map((elo, index) => ({
          user_id: elo.user.user_id,
          username: elo.user.username,
          avatar_id: elo.user.avatar_id,
          league: elo.user.league,
          rating: elo.rating,
          rank: index + 1
        })),
        total
      }
    }

    async getUserRank(user_id: string): Promise<RankDTO | null> {

        const sorted = await this.eloRepository
        .createQueryBuilder()
        .innerJoinAndSelect('elo.user', 'user')
        .orderBy('elo.rating', 'DESC')
        .getMany();

        const index 
        
        
    }
}