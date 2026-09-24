
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { AdminDeleteUserCommand, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { signUp } from "@aws-amplify/auth";
import { cognito_identity_client } from "../../../src/application/usecases/services/cognito.service";
import { CreateUser } from '../../../src/application/usecases/services/user-creation.service';
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { Users } from "../../../src/entities/database/user.entities"
import { IEquippedRepository } from '../../../src/application/interfaces/repositories/IEquippedRepository'
import { EquippedRepository } from '../../../src/interface-adapters/repositories/equipped.repository';
import { EquippedItems } from "../../../src/entities/database/equipped-items.entities";
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import dotenv from 'dotenv'
import { DataSource, Repository } from "typeorm";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
dotenv.config()

const cognito_client = cognito_identity_client;

let users_count = 0;
let data_source: DataSource;
let users: IUserRepository;
let equip: IEquippedRepository;
let create_user: CreateUser

let user_repo: Repository<Users>

describe("Tests user creation ", () => {
    const username = `test_${users_count++}`;
    const email = `${username}@example.com`;
    const password = "Strong_Testuserpassword123!"

    beforeAll(async () => {
        data_source = await createTestDataSource();
        user_repo = data_source.getRepository(Users);
        users = new UserRepository(user_repo);

        const shop_repo = new ShopItemRepository(data_source.getRepository(ShopItem));
        await data_source.getRepository(ShopItem).save([{
            category: 'theme',
            name: 'Cosmo (dark)',
            description: 'Default theme',
            price: 100,
            rarity: 'common',
            metadata: { hex_color_1: "#c0395a", hex_color_2: "#530a23", hex_color_3: "#fcecdd" }
        },
        {
            category: 'avatar',
            name: 'Vexa',
            description: "She appeared through a mysterious portal beyond the edge of mapped space. Her technology is unlike anything in the galaxy and she seems strangely familiar with Earth's programming languages.",
            price: 2500,
            rarity: 'common',
            metadata: { asset_key: 'vexa'}
       
        }
    ])


        equip = new EquippedRepository(data_source.getRepository(EquippedItems), shop_repo);

        create_user = new CreateUser(users, equip, shop_repo);


    })


    afterAll(async () => {
        await cognito_client.send(new AdminDeleteUserCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username
        }))
    })


    it("Adds new users to the db after sign up confirmation", async () => {

        await signUp({
            username: username,
            password: password,
            options: {
                userAttributes: {
                    email: email,
                    preferred_username: username,
                    phone_number: "+27685338762",
                    name: username
                }
            }
        })

        await cognito_client.send(new AdminConfirmSignUpCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username
        }))


        await create_user.create(username, email);

        const created = await user_repo.findOneBy({ email: email });
        expect(created).not.toBeNull();
        expect(created!.username).toBe(username);

    })
})