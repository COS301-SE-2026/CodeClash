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


    afterAll(async () => {
        await data_source.destroy()
    })
})