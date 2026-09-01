import { IEloRepository } from "src/application/interfaces/repositories/IEloRepository";
import { Repository } from "typeorm";
import { EloHistory, EloRatings } from "src/entities/db-entities/elo.entities";
import { EloDTO, EloUpdateResultDTO } from "src/interface-adapters/dtos/elo.dto";
import { AppDataSource } from "src/frameworks-drivers/config/data-source";

import { LeaderboardEntryDTO } from "../dtos/leaderboard.dto";
import { RankDTO } from "../dtos/rank.dto";

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

    async getLeaderboard(limit: number, offset: number): Promise<{ data: LeaderboardEntryDTO[]; total: number }> {
      const [results, total] = await this.eloRepository
        .createQueryBuilder('elo')
        .innerJoinAndSelect('elo.user', 'user')
        .orderBy('elo.rating', 'DESC')
        .addOrderBy('user.username', 'ASC')
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

  // async getUserRank(user_id: string): Promise<number | null> {
  //   const row = await this.eloRepository.findOne({
  //     where: { user: { user_id: user_id } },
  //     relations: { user: true }
      
  //   })

  //   if (!row) return null;

  //   const ahead = await this.eloRepository
  //     .createQueryBuilder('elo')
  //     .innerJoin('elo.user', 'user')
  //     .where('elo.rating > :rating', { rating: row.rating })
  //     .orWhere('elo.rating = :rating AND user.username < :username',
  //     { rating: row.rating, username: row.user.username })
  //     .getCount()

  //   return ahead + 1;
  // }

    async updateRatingsAfterMatch(
        match_id: string,
        winner_id: string,
        loser_id: string
    ): Promise<{ winner: EloUpdateResultDTO; loser: EloUpdateResultDTO }> {
        
        const winnerRating = await this.getElo(winner_id);
        const loserRating = await this.getElo(loser_id);

        if(!winnerRating?.rating || !loserRating?.rating) {
            throw new Error("Players need to have a previous elo to update it");
        }

        const expectedWinner = 1 / (1 + Math.pow(10, (loserRating.rating - winnerRating.rating) /400));
        const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating.rating - loserRating.rating) /400));

        const newWinnerRating = Math.round(winnerRating.rating + K_FACTOR * (1 - expectedWinner));
        const newLoserRating = Math.round(loserRating.rating + K_FACTOR * (0 - expectedLoser));

        const eloGained = newWinnerRating - winnerRating.rating;
        const eloLost  = loserRating.rating - newLoserRating;

        await this.eloRepository.update({ user: { user_id: winner_id } }, { rating: newWinnerRating});
        await this.eloRepository.update({ user: { user_id: loser_id } }, { rating: newLoserRating});

        await this.historyRepo.save(this.historyRepo.create({
            user: { user_id: winner_id } as any,
            match: { match_id } as any,
            old_rating: winnerRating.rating,
            new_rating: newWinnerRating
        }));

        await this.historyRepo.save(this.historyRepo.create({
            user: { user_id: loser_id } as any,
            match: { match_id } as any,
            old_rating: loserRating.rating,
            new_rating: newLoserRating
        }));

        return{
            winner: { user_id: winner_id, old_rating: winnerRating.rating, new_rating: newWinnerRating, elo_gained: eloGained },
            loser: { user_id: loser_id, old_rating: loserRating.rating, new_rating: newLoserRating, elo_gained: -eloLost }
        }
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

