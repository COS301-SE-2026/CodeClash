import { DataSource, Repository } from "typeorm";
import { createTestDataSource } from "./test-data-source";
import { describe, beforeAll, afterAll, it, expect } from "vitest";
import { Users } from '../../../src/entities/db-entities/user.entities'
import { EloRatings } from '../../../src/entities/db-entities/elo.entities'
import { mock_users_array } from "./mocks/mock-user";
import { EloRepository } from '../../../src/interface-adapters/repositories/elo.repository'


let data_source: DataSource
let elo_entity: Repository<EloRatings>
let mock_user: Users[]
let elo_repo: EloRepository

describe("Elo Repository Queries", () => {

    beforeAll(async () => {
        data_source = await createTestDataSource()

        mock_user = await data_source.getRepository(Users).save(mock_users_array)
        elo_entity = data_source.getRepository(EloRatings)
        elo_repo = new EloRepository(elo_entity)

    })

    it('Stores user elo in the database', async () => {
        await elo_repo.createUserElo(mock_user[0].user_id);

        const expected = mock_user[0].user_id
        const saved = await data_source.getRepository(EloRatings).findOne({
            where: { user: { user_id: expected } }
        })

        expect(saved).not.toBeNull()
    })

    it('Get a valid users elo', async () => {
        const fetched_elo = await elo_repo.getElo(mock_user[0].user_id);

        expect(fetched_elo.rating).toBe(600);
    })

    it("Get an invalid users elo", async () => {
        const fetched_elo = await elo_repo.getElo(mock_user[1].user_id);

        expect(fetched_elo).toBeNull()
    })

    it("Gets elo for an array of valid users", async () => {
        // add the rest of the mock users elos
        const ids = [mock_user[0].cognito_id];

        for (let i = 1; i < mock_user.length; i++) {
            await elo_repo.createUserElo(mock_user[i].user_id);
            ids.push(mock_user[i].cognito_id)
        }

        const fetched_elos = await elo_repo.getUsersElo(ids);
        expect(fetched_elos).not.toBeNull();
        expect(fetched_elos).toHaveLength(3);
    })


    it("Gets elo for an array of invalid users", async () => {
        const ids = ['01', '02', '03']

        const fetched_elos = await elo_repo.getUsersElo(ids);

        expect(fetched_elos).toBeNull();
    })

    it("Ranks tied users by username so ranks are stable and unique", async () => {
        const ranks = await Promise.all(mock_user.map(u => elo_repo.getUser(u.user_id)))
        expect(ranks).toEqual([1,2,3])
    })

    it("Ranks a higher rated user above everyone else", async () => {
        await elo_entity.update({ user: { user_id: mock_user[2].user_id } }, { rating: 1000 })
        expect(await elo_repo.getUserRank(mock_user[2].user_id)).toBe(1)
               expect(await elo_repo.getUserRank(mock_user[0].user_id)).toBe(2)
               expect(await elo_repo.getUserRank(mock_user[1].user_id)).toBe(3)
    })

    it("Moves a user's rank when their rating changes", async () => {
            const before = await elo_repo.getUserRank(mock_user[1].user_id)
    
            await elo_entity.update({ user: { user_id: mock_user[1].user_id } }, { rating: 1200 })
    
            const after = await elo_repo.getUserRank(mock_user[1].user_id)
    
            expect(before).toBe(3)
            expect(after).toBe(1)
        })
  
    it("Returns null for a user that has no elo record", async () => {
           const [user_without_elo] = await data_source.getRepository(Users).save([{
               cognito_id: 'cognito-user-id_no_elo',
               username: 'integration_test_user_no_elo',
               email: 'integration_no_elo@test.com',
               avatar_id: 0,
               league: "Mercury",
               current_streal: 0,
               winning_streak: 0
           }])
   
           expect(await elo_repo.getUserRank(user_without_elo.user_id)).toBeNull()
       })

    it("Returns the leaderboard ordered by rating then username", async () => {
        const { data, total } = await elo_repo.getLeaderboard(10, 0)

        expect(total).toBe(3)
        expect(data.map(entry => entry.username)).toEqual([
            'integration_test_user_02', // 1200
            'integration_test_user_03', // 900
            'integration_test_user_01', // 600
        ])
        expect(data.map(entry => entry.rating)).toEqual([1200, 900, 600])
    })

    it("Gives every leaderboard entry the same rank getUserRank reports", async () => {
        const { data } = await elo_repo.getLeaderboard(10, 0)

        for (const entry of data) {
            expect(entry.rank).toBe(await elo_repo.getUserRank(entry.user_id))
        }
    })

    it("Paginates the leaderboard with the given limit and offset", async () => {
        const first_page = await elo_repo.getLeaderboard(2, 0)
        const second_page = await elo_repo.getLeaderboard(2, 2)

        expect(first_page.data).toHaveLength(2)
        expect(first_page.total).toBe(3)
        expect(second_page.data).toHaveLength(1)
        expect(second_page.total).toBe(3)
        expect(second_page.data[0].username).toBe('integration_test_user_01')
    })
  


    afterAll(async () => {
        await data_source.destroy()
    })
})