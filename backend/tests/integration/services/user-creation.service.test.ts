
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { AdminDeleteUserCommand, AdminConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { signUp } from "@aws-amplify/auth";
import { cognito_identity_client } from "../../../src/application/usecases/services/cognito.service";
import { CreateUser } from '../../../src/application/usecases/services/user-creation.service';
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository';
import {IEloRepository} from '../../../src/application/interfaces/repositories/IEloRepository'
import { EloRepository } from '../../../src/interface-adapters/repositories/elo.repository';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { EloRatings } from '../../../src/entities/database/elo.entities';
import { Users } from "../../../src/entities/database/user.entities"

import dotenv from 'dotenv'
import { DataSource, Repository } from "typeorm";
import { createTestDataSource } from "../../test-data-source";
import { EquippedItems } from "../../../src/entities/database/equipped-items.entities";
dotenv.config()
import { IEquippedRepository } from '../../../src/application/interfaces/repositories/IEquippedRepository';
import { IShopItemRepository } from '../../../src/application/interfaces/repositories/IShopItemRepository';
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { EquippedRepository } from "../../../src/interface-adapters/repositories/equipped.repository";
const cognito_client = cognito_identity_client;

let users_count = 0;
let data_source: DataSource;
let users: IUserRepository;
let elo: IEloRepository;
let create_user: CreateUser;
let equipped_repo: IEquippedRepository;
let shop_item_repo: ShopItemRepository;

let user_repo: Repository<Users>

describe("Tests user creation ", () => {
    const username = `test_${users_count++}`;
    const email = `${username}@example.com`;
    const password = "Strong_Testuserpassword123!"

    beforeAll(async () => {
        data_source = await createTestDataSource();
        user_repo = data_source.getRepository(Users);

        users = new UserRepository(user_repo);
        elo = new EloRepository(data_source.getRepository(EloRatings));
        shop_item_repo = new ShopItemRepository(data_source.getRepository(ShopItem));
        equipped_repo = new EquippedRepository(data_source.getRepository(EquippedItems), shop_item_repo );

        await data_source.getRepository(ShopItem).save({
            category: 'theme', name: 'Default', price: 0, rarity: 'common',
            metadata: { hex_color_1: '#000', hex_color_2: '#000', hex_color_3: '#000', is_default: true }
        });
        create_user = new CreateUser(users, elo, equipped_repo, shop_item_repo);
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