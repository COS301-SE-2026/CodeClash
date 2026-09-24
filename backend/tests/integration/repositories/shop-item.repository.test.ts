import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { DataSource } from "typeorm";
import { createTestDataSource } from "../../test-data-source";
import { ShopItem } from "../../../src/entities/database/shop-item.entities";
import { ShopItemRepository } from "../../../src/interface-adapters/repositories/shop-item.repository";
import { mock_shop_items } from "../../mocks/mock-shop-items";

let data_source: DataSource;
let repo: ShopItemRepository;
let create_ids: string[] = [];

describe('Tests ShopItemRepositor', () => {
    beforeAll(async () => {

    });

    afterAll(async () => {

    });

    it('Returns all shop items', async () => {

    });

    it('Correctly maps category and metadata', async () => {

    });

    it('Returns the default theme (lowest priced theme item)', async () => {

    });
});