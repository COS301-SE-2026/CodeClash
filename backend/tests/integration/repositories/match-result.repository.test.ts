import { DataSource, Repository } from "typeorm";
import { describe, beforeAll, afterAll, it, expect, vi } from "vitest";

import { createTestDataSource } from "../repositories/test-data-source";
import { mock_users_array } from "../repositories/mocks/mock-user";
import { Users } from '../../../src/entities/db-entities/user.entities'
import { EloRatings } from '../../../src/entities/db-entities/elo.entities'
import { EloRepository } from '../../../src/interface-adapters/repositories/elo.repository'
import { MatchResultService } from '../../../src/application/usecases/services/match-result.service'
import { IEloRepository } from '../../../src/application/interfaces/repositories/IEloRepository'
import { IMatchResultRepository } from '../../../src/application/interfaces/repositories/IMatchResultRepository'
import { EloUpdateResultDTO } from '../../../src/interface-adapters/dtos/elo.dto'

let data_source: DataSource
let elo_entity: Repository<EloRatings>
let elo_repo: EloRepository
let mock_user: Users[]
let service: MatchResultService

const testEloRepository = (repo: EloRepository, entity: Repository<EloRatings>): IEloRepository => ({
  createUserElo: (user_id: string) => repo.createUserElo(user_id),
  getElo: (user_id: string) => repo.getElo(user_id),
  getUsersElo: (user_ids: string[]) => repo.getUsersElo(user_ids),
  getUserRank: (user_id: string) => repo.getUserRank(user_id),

  async updateRatingsAfterMatch(_match_id: string, winner_id: string, loser_id: string) {
    const apply = async (user_id: string, delta: number): Promise<EloUpdateResultDTO> => {
      const old_rating = (await repo.getElo(user_id))!.rating!
      const new_rating = old_rating + delta

      await entity.update({ user: { user_id } }, { rating: new_rating })

      return {
        user_id,
        old_rating,
        new_rating,
        elo_gained: delta, 
      }
    }
      return { winner: await apply(winner_id, 200), loser: await apply(loser_id, -200)}
  },
})

const mockMatchResultRepo: IMatchResultRepository = {
    saveMatchLog: vi.fn(),
    getUserDetails: vi.fn(),
    buildMatchResult: vi.fn(),
}
