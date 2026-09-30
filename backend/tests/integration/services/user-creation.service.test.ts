
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { AdminDeleteUserCommand, AdminCreateUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { cognito_identity_client } from "../../../src/application/usecases/services/cognito.service";
import { CreateUser } from '../../../src/application/usecases/services/user-creation.service';
import { IUserRepository } from '../../../src/application/interfaces/repositories/IUserRepository';
import { UserRepository } from '../../../src/interface-adapters/repositories/user.repository';
import { Users } from "../../../src/entities/database/user.entities"
import {IEquippedRepository} from '../../../src/application/interfaces/repositories/IEquippedRepository'
import {EquippedRepository} from '../../../src/interface-adapters/repositories/equipped.repository'
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import {IShopItemRepository} from '../../../src/application/interfaces/repositories/IShopItemRepository'
import {IWalletRepository} from '../../../src/application/interfaces/repositories/IWalletRepository'
import dotenv from 'dotenv'
import { DataSource, Repository } from "typeorm";
import { createTestDataSource } from "../../test-data-source";
import { EquippedItems } from "../../../src/entities/database/equipped-items.entities";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { WalletRepository } from "../../../src/interface-adapters/repositories/wallet.repository";
import { Wallet } from "../../../src/entities/database/wallet.entities";

dotenv.config()

const cognito_client = cognito_identity_client;

let users_count = 0;
let data_source: DataSource;
let users: IUserRepository;
let create_user: CreateUser
let equipped_repo: IEquippedRepository
let shop_item_repo: IShopItemRepository
let wallet_repo: IWalletRepository

let user_repo: Repository<Users>

describe("Tests user creation ", () => {
    const username = `test_${users_count++}`;
    const email = `${username}@example.com`;

    beforeAll(async () => {
        data_source = await createTestDataSource();
        user_repo = data_source.getRepository(Users);
        shop_item_repo = new ShopItemRepository(data_source.getRepository(ShopItem));
        equipped_repo = new EquippedRepository(data_source.getRepository(EquippedItems), shop_item_repo);
        wallet_repo = new WalletRepository(data_source.getRepository(Wallet));
        users = new UserRepository(user_repo);

        await data_source.getRepository(ShopItem).save({
          name: "Cosmic (dark)",
          category: 'theme',
          description: 'The default theme.',
          price: 200,
          rarity: 'common',
          metadata:{},
          created_at: new Date()

        })

        await data_source.getRepository(ShopItem).save({
          name: "Vexa",
          category: 'avatar',
          description: 'The default avatar.',
          price: 200,
          rarity: 'common',
          metadata:{},
          created_at: new Date()

        })

        create_user = new CreateUser(users,equipped_repo, shop_item_repo,wallet_repo);


    })


    afterAll(async () => {
        await cognito_client.send(new AdminDeleteUserCommand({
            UserPoolId: process.env.COGNITO_USER_POOL_ID,
            Username: username
        }))
    })


    it("Adds new users to the db after sign up confirmation", async () => {
      
      await cognito_client.send(new AdminCreateUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: username,
        MessageAction: 'SUPPRESS',
        UserAttributes: [
          { Name: 'email', Value: email },
          { Name: 'preferred_username', Value: username },
          { Name: 'phone_number', Value: "+27685338762" },
          { Name: 'name', Value: username },
        ]
      }))


        await create_user.create(username, email);

        const created = await user_repo.findOneBy({ email: email });
        expect(created).not.toBeNull();
        expect(created!.username).toBe(username);

    })
})