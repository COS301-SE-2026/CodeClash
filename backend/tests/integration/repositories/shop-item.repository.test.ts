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
        
    });

    it('Correctly maps category and metadata', async () => {

    });

    it('Returns the default theme (lowest priced theme item)', async () => {

    });
});