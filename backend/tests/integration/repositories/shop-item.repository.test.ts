import { describe, expect, it, beforeAll, afterAll, should } from "vitest";
import { DataSource } from "typeorm";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { mock_shop_items } from "../../mocks/mock-shop-items";
import { create } from "node:domain";

let data_source: DataSource;
let repo: ShopItemRepository;
let created_ids: string[] = [];

describe('Tests ShopItemRepositor', () => {
    beforeAll(async () => {
        data_source = await createTestDataSource();
        repo = new ShopItemRepository(data_source.getRepository(ShopItem));

        const saved  = await data_source.getRepository(ShopItem).save(mock_shop_items);
        created_ids = saved.map(i => i.shop_item_id);
    });

    afterAll(async () => {
        await data_source.getRepository(ShopItem).delete(created_ids);
    });

    it('Returns all shop items', async () => {
        const items = await repo.getAllItems();

        expect(items.length).toBeGreaterThanOrEqual(mock_shop_items.length);
        expect(items.some(i => i.name === 'Test Shield')).toBe(true);
    });

    it('Correctly maps category and metadata', async () => {
        const items = await repo.getAllItems();
        const theme = items.find(i => i.name === 'Test Nebula');

        expect (theme).toBeDefined();
        expect(theme!.category).toBe('theme');
        expect((theme!.metadata as any).hex_color_1).toBe('#8b3fd6');
        expect((theme!.metadata as any).hex_color_2).toBe('#4a1d80');
        expect((theme!.metadata as any).hex_color_3).toBe('#f0e5fc');
    });

    it('Returns the default theme (lowest priced theme item)', async () => {
        const result = await repo.getItemById(crypto.randomUUID());

        expect(result.name).toBe('Default');
        expect(result.price).toBe(0);
    });
});