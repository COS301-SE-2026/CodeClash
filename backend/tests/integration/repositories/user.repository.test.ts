import { DataSource, Repository } from "typeorm";
import { Users } from "../../../src/entities/db-entities/user.entities";
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository'
import { beforeAll, describe, expect, it, afterAll } from "vitest";
import { createTestDataSource } from "./test-data-source";
import { mock_user } from "./mocks/mock-user";



let data_source: DataSource
let user_entity: Repository<Users>
let user_repo: UserRepository


const user = mock_user;

describe("User Repository Quesries", () => {
    beforeAll(async () => {
        data_source = await createTestDataSource();
        user_entity = data_source.getRepository(Users);
        user_repo = new UserRepository(user_entity);
    })


    it("Stores a user in the database", async () => {
        const add = await user_repo.createUser(user.username, user.email, user.cognito_id, user.avatar_id, user.league);

        const uuid_regex = /^[0-9a-fA-f]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/

        expect(add).toBeDefined()
        expect(add.user_id).toMatch(uuid_regex)

        user.user_id = add.user_id;
    })


    it("Gets a valid user from the db", async () => {
        const fetched = await user_repo.getUser(user.user_id)

        expect(fetched).toBeDefined()
        expect(fetched.cognito_id).toBe(user.cognito_id)
    })


    afterAll(async () => {
        await data_source.destroy()
    })
})

