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

describe("Match result ranking", () => {
  beforeAll(async () => {
    data_source = await createTestDataSource()

    mock_user = await data_source.getRepository(Users).save(mock_users_array)
    elo_entity = data_source.getRepository(EloRatings)
    elo_repo = new EloRepository(elo_entity)

    for (const user of mock_user) {
      await elo_repo.createUserElo(user.user_id)
    }

    await elo_entity.update({ user: { user_id: mock_user[1].user_id } }, { rating: 700 })
    await elo_entity.update({ user: { user_id: mock_user[2].user_id } }, { rating: 800 })

    vi.mocked(mockMatchResultRepo.getUserDetails).mockImplementation(async (user_id: string) => ({
      username: mock_user.find(u => u.user_id === user_id)!.username,
      avatar: 0,
    }))

    service = new MatchResultService(testEloRepository(elo_repo, elo_entity), mockMatchResultRepo)
    
  })

  const statsFor = (winner: Users, loser: Users) => ([
          { user_id: winner.user_id, correctness: 80, speed: 150 },
          { user_id: loser.user_id, correctness: 60, speed: 190 },
      ]) 

  it("Reports the rank each player held before the match and the rank they hold after it", async () => {
          const winner = mock_user[0]
          const loser = mock_user[2]
  
          const result = await service.finaliseMatch(
              'match-uuid', winner.user_id, loser.user_id, true, statsFor(winner, loser)
          )
  
          const winner_result = result.players.find(p => p.user_id === winner.user_id)!
          const loser_result = result.players.find(p => p.user_id === loser.user_id)!
  
          // winner 600 -> 800, loser 800 -> 600
          expect(winner_result.rank_before).toBe(3)
          expect(winner_result.rank).toBe(1)
          expect(loser_result.rank_before).toBe(1)
          expect(loser_result.rank).toBe(3)
      })
})