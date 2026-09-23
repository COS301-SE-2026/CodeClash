import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { randomUUID } from "node:crypto";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { EquippedItems } from "../../../src/entities/database/equipped-items.entities";
import { Users } from "../../../src/entities/database/user.entities";
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { EquippedRepository } from "../../../src/interface-adapters/repositories/equipped.repository";
import { UserRepository } from "../../../src/interface-adapters/repositories/user.repository";
import { IUserRepository } from "../../../src/application/interfaces/repositories/IUserRepository";
import { mock_shop_items } from "../../mocks/mock-shop-items";
import { mock } from "node:test";

let data_source: DataSource;
let repo: EquippedRepository;
let shop_item_mapper: ShopItemRepository;
let user_repo: IUserRepository;

let user_id: string;
const cognito_id = randomUUID();
const username = `equipped_test_${randomUUID}`;
let item_ids: string[] = [];

describe('Tests EquippedRespository', () => {
    beforeAll(async () => {
        data_source = await createTestDataSource();
        shop_item_mapper = new ShopItemRepository(data_source.getRepository(ShopItem));
        repo = new EquippedRepository(data_source.getRepository(EquippedItems), shop_item_mapper);
        user_repo = new UserRepository(data_source.getRepository(Users));

        const user = await user_repo.createUser(username, `${username}@example.com`, cognito_id, 0, 'Mercury');
        user_id = user.user_id!;

        const saved = await data_source.getRepository(ShopItem).save(mock_shop_items);
        item_ids = saved.map(i => i.shop_item_id);
        
    });

    afterAll(async () => {
        await data_source.getRepository(EquippedItems).delete({ user: { user_id } });
        await data_source.getRepository(ShopItem).delete(item_ids);
        await data_source.getRepository(Users).delete({ cognito_id });
    });

    it('Returns null before any items are equipped (raw repo, bypasses CreateUser default theme and avatar assignment)', async () => {
        const result = await repo.getEquipped(user_id);

        expect(result).toBeNull();
    });

    it('Creates an equipped row on first update', async () => {
        const theme_id = item_ids.find((_, i) => mock_shop_items[i]!.category === 'theme')!;
        const result = await repo.updateEquipped(user_id, { theme_id });

        expect(result.theme.shop_item_id).toBe(theme_id);
    });

    it('Updates one slot without clearing another', async () => {
        const powerup_id = item_ids.find((_, i) => mock_shop_items[i]!.category === 'powerup')!;
        const result = await repo.updateEquipped(user_id, { powerup_item_id: powerup_id });

        expect(result.powerup!.shop_item_id).toBe(powerup_id);
        expect(result.theme).toBeDefined(); // theme from previous test still equipped
    });

    it('Replaces a previously equipped item in the same slot', async () => {
        const themes = item_ids.filter((_, i) => mock_shop_items[i]!.category === 'theme');
        await repo.updateEquipped(user_id, { theme_id: themes[0] });
        const result = await repo.updateEquipped(user_id, { theme_id: themes[1] });

        expect(result.theme.shop_item_id).toBe(themes[1]);
    });
});