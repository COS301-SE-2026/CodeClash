import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { randomUUID } from "node:crypto";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { UserItem } from "../../../src/entities/database/user-item.entities";
import { Users } from "../../../src/entities/database/user.entities"; 
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { InventoryRepository } from "../../../src/interface-adapters/repositories/inventory.repository";
import { UserRepository } from "../../../src/interface-adapters/repositories/user.repository";
import { IUserRepository } from "../../../src/application/interfaces/repositories/IUserRepository";
import { mock_shop_items } from "../../mocks/mock-shop-items";

let data_source: DataSource;
let repo: InventoryRepository;
let shop_item_mapper: ShopItemRepository;
let user_repo: IUserRepository;

let user_id: string;
const cognito_id = randomUUID();
const username = `equipped_test_${randomUUID}`;
let item_ids: string[] = [];

describe('Tests InventoryRepository', () =>{
    beforeAll(async () => {
        data_source = await createTestDataSource();
        shop_item_mapper = new ShopItemRepository(data_source.getRepository(ShopItem));
        repo = new InventoryRepository(data_source.getRepository(UserItem), shop_item_mapper);
        user_repo = new UserRepository(data_source.getRepository(Users));

        const user = await user_repo.createUser(username, `${username}@example.com`, cognito_id, 0, 'Mercury');
        user_id = user.user_Id!;

        const saved = await data_source.getRepository(ShopItem).save(mock_shop_items);
        item_ids = saved.map(i => i.shop_item_id);
    });

    afterAll(async () => {
        await data_source.getRepository(UserItem).delete({ user: { user_id } });
        await data_source.getRepository(ShopItem).delete(item_ids);
        await data_source.getRepository(Users).delete({ cognito_id });
    });

    it('Grants and returns an owned item', async () => {
        await data_source.getRepository(UserItem).save(
            data_source.getRepository(UserItem).create({
                user: { user_id } as any,
                shop_item: { shop_item_id: item_ids[0] } as any
            })
        );

        const items = await repo.getUserItems(user_id);

        expect(items).toHaveLength(1);
        expect(items[0].item.shop_item_id).toBe(item_ids[0]);
    });

    it('Confirms hasItem is true for an owned item', async () => {
        const owned = await repo.hasItem(user_id, item_ids[0]!);

        expect(owned).toBe(true);
    });

    it('Returns only powerup-category items from getUserPowerups', async () => {

    });
});